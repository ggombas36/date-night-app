import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel: string;
  /** Leave out for a message with a single button. */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onCancel();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-sm rounded-[20px] bg-surface p-6 text-ink shadow-sheet"
    >
      <p className="mb-6 text-lg">{message}</p>
      <div className="flex justify-end gap-2">
        {cancelLabel && (
          <button type="button" onClick={onCancel} className="btn-text">
            {cancelLabel}
          </button>
        )}
        <button type="button" onClick={onConfirm} className="btn-primary">
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
