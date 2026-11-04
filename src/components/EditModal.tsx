import { useEffect, useRef, useState, type FormEvent } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { DatePlan } from "../types/DatePlan";

interface EditModalProps {
  plan: DatePlan;
  isNew: boolean;
  /** Resolve when saved, throw an Error with a readable message when not. */
  onSave: (plan: DatePlan) => Promise<void>;
  onClose: () => void;
}

const HINT_MAX = 160;

interface Step {
  key: number;
  text: string;
}

const toInputDate = (value: string) => value.replace(/\./g, "-");
const fromInputDate = (value: string) => value.replace(/-/g, ".");

export default function EditModal({ plan, isNew, onSave, onClose }: EditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextKey = useRef(plan.activities.length);
  const [title, setTitle] = useState(plan.title);
  const [date, setDate] = useState(toInputDate(plan.date));
  const [opensAt, setOpensAt] = useState(plan.opensAt ?? "");
  const [hint, setHint] = useState(plan.hint ?? "");
  const [description, setDescription] = useState(plan.description);
  const [steps, setSteps] = useState<Step[]>(plan.activities.map((text, key) => ({ key, text })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const updateStep = (key: number, text: string) =>
    setSteps((prev) => prev.map((step) => (step.key === key ? { ...step, text } : step)));

  const addStep = () => setSteps((prev) => [...prev, { key: nextKey.current++, text: "" }]);

  const removeStep = (key: number) => setSteps((prev) => prev.filter((step) => step.key !== key));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const planDate = fromInputDate(date);
    const saved: DatePlan = {
      ...plan,
      id: isNew ? planDate.replace(/\./g, "-") : plan.id,
      title: title.trim(),
      date: planDate,
      description: description.trim(),
      activities: steps.map((step) => step.text.trim()).filter(Boolean),
      hint: hint.trim() || undefined,
      opensAt: opensAt || undefined,
    };
    try {
      await onSave(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Your changes are still here.");
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      aria-labelledby="edit-title"
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-surface p-0 text-ink md:m-auto md:h-auto md:max-h-[90dvh] md:max-w-[560px] md:rounded-[20px] md:shadow-sheet"
    >
      <form onSubmit={handleSubmit} className="flex h-full max-h-dvh flex-col md:max-h-[90dvh]">
        <div className="flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
          <h2 id="edit-title" className="text-[28px] font-semibold leading-tight">
            {isNew ? "New date" : "Edit date"}
          </h2>

          <div>
            <label htmlFor="edit-name" className="label">
              Title
            </label>
            <input id="edit-name" className="field" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-date" className="label">
                Date
              </label>
              <input
                id="edit-date"
                type="date"
                className="field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-opens" className="label">
                Opens at (optional)
              </label>
              <input
                id="edit-opens"
                type="datetime-local"
                className="field"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-hint" className="label">
              Hint (optional)
            </label>
            <input
              id="edit-hint"
              className="field"
              value={hint}
              maxLength={HINT_MAX}
              onChange={(e) => setHint(e.target.value)}
              aria-describedby="edit-hint-count"
            />
            <p id="edit-hint-count" className="mt-1 text-sm text-muted">
              {hint.length}/{HINT_MAX}. Shown while the seal is closed.
            </p>
          </div>

          <div>
            <label htmlFor="edit-description" className="label">
              Description
            </label>
            <textarea
              id="edit-description"
              className="field min-h-28"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <fieldset>
            <legend className="label">Plan</legend>
            <ul className="space-y-2">
              {steps.map((step, index) => (
                <li key={step.key} className="flex items-center gap-2">
                  <input
                    className="field"
                    aria-label={`Step ${index + 1}`}
                    value={step.text}
                    onChange={(e) => updateStep(step.key, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(step.key)}
                    className="btn-text shrink-0 px-2"
                    aria-label={`Remove step ${index + 1}`}
                  >
                    <TrashIcon className="size-5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={addStep} className="btn-text mt-2">
              <PlusIcon className="size-5" aria-hidden="true" />
              Add step
            </button>
          </fieldset>
        </div>

        <div className="border-t border-rule bg-surface p-4 md:px-6">
          {error && (
            <p role="alert" className="mb-3 text-accent">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={saving} className="btn-text">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
