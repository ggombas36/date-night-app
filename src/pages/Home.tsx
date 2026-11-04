import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDialog from "../components/ConfirmDialog";
import EditModal from "../components/EditModal";
import Header from "../components/Header";
import Invitation from "../components/Invitation";
import Login from "../components/Login";
import Photos from "../components/Photo";
import TabBar, { type Tab } from "../components/TabBar";
import datePlans from "../data/datePlans.json";
import { photos } from "../data/photos";
import { useAuth } from "../hooks/useAuth";
import { useNow } from "../hooks/useNow";
import { useOpenedSeals } from "../hooks/useOpenedSeals";
import { getSealState, isPast, pickCurrentIndex, sortNewestFirst } from "../lib/plans";
import { dateApiService } from "../services/dateApiServices";
import type { DatePlan } from "../types/DatePlan";

const VERSION = "2.0.0";

const LOCAL_PLANS: DatePlan[] = datePlans.map((plan) => ({ ...plan, is_deleted: plan.is_deleted ?? false }));

type LoadState = "loading" | "ready" | "fallback";

type Editing = { plan: DatePlan; isNew: boolean } | null;

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-[20px] bg-surface p-6 shadow-sheet md:p-8" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="h-8 w-3/4 rounded bg-ink/10" />
      <div className="h-5 w-1/3 rounded bg-ink/10" />
      <div className="h-24 rounded bg-ink/10" />
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const now = useNow();
  const { isOpened, markOpened } = useOpenedSeals();
  const [tab, setTab] = useState<Tab>("next");
  const [plans, setPlans] = useState<DatePlan[]>(LOCAL_PLANS);
  const [load, setLoad] = useState<LoadState>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastPlanNotice, setLastPlanNotice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    dateApiService
      .getAllPlans()
      .then((fetched) => {
        if (cancelled) return;
        if (fetched.length > 0) setPlans(fetched.map((plan) => ({ ...plan, is_deleted: plan.is_deleted ?? false })));
        setLoad("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setPlans(LOCAL_PLANS);
        setLoad("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const active = useMemo(() => sortNewestFirst(plans.filter((plan) => !plan.is_deleted)), [plans]);

  const selectedIndex = active.findIndex((plan) => plan.id === selectedId);
  const index = selectedIndex >= 0 ? selectedIndex : pickCurrentIndex(active, now);
  const plan = active[index];
  const allPast = active.length > 0 && active.every((p) => isPast(p, now));
  const isLastTime = allPast && index === 0 && selectedIndex < 0;

  if (!isAuthenticated) return <Login />;

  const editingPaused = load !== "ready";

  const save = async (saved: DatePlan, isNew: boolean) => {
    if (editingPaused) throw new Error("Editing is paused while the saved copy is showing.");
    let id = saved.id;
    if (isNew) {
      let n = 2;
      while (plans.some((p) => p.id === id)) id = `${saved.id}-${n++}`;
    }
    const next = isNew
      ? [{ ...saved, id, is_deleted: false }, ...plans]
      : plans.map((p) => (p.id === saved.id ? { ...saved, is_deleted: false } : p));
    const ok = await dateApiService.updatePlans(next);
    if (!ok) throw new Error("Couldn't save. Your changes are still here.");
    setPlans(next);
    setSelectedId(id);
    setEditing(null);
  };

  const startDelete = () => {
    if (active.length <= 1) setLastPlanNotice(true);
    else setConfirmDelete(true);
  };

  const deleteCurrent = async () => {
    setConfirmDelete(false);
    if (!plan || editingPaused) return;
    const next = plans.map((p) => (p.id === plan.id ? { ...p, is_deleted: true } : p));
    if (await dateApiService.updatePlans(next)) {
      setPlans(next);
      setSelectedId(null);
    }
  };

  const goEarlier = () => setSelectedId(active[Math.min(index + 1, active.length - 1)].id);
  const goLater = () => setSelectedId(active[Math.max(index - 1, 0)].id);

  const blankPlan: DatePlan = { id: "", title: "", date: "", description: "", activities: [] };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onLogout={logout} />
      <TabBar active={tab} onChange={setTab} />

      <main
        className={`mx-auto w-full flex-1 px-4 pt-4 pb-24 md:pb-8 ${
          tab === "memories" ? "max-w-5xl" : "max-w-[520px] xl:max-w-[560px]"
        }`}
      >
        {tab === "memories" ? (
          <Photos photos={photos} />
        ) : (
          <div className="space-y-4">
            {load === "fallback" && (
              <p role="status" className="rounded-xl bg-surface/92 px-4 py-2 text-muted">
                Showing the saved copy. Couldn't reach the latest.
              </p>
            )}

            {load === "loading" || !plan ? (
              <Skeleton />
            ) : (
              <>
                <Invitation
                  key={plan.id}
                  plan={plan}
                  state={getSealState(plan, now, isOpened(plan.id), isAdmin)}
                  isLastTime={isLastTime}
                  isAdmin={isAdmin}
                  onBreak={markOpened}
                />

                <nav aria-label="Browse dates" className="flex items-center justify-between rounded-xl bg-surface/92 px-1">
                  <button
                    type="button"
                    onClick={goEarlier}
                    disabled={index >= active.length - 1}
                    className="btn-text"
                    aria-label={index < active.length - 1 ? `Earlier date: ${active[index + 1].title}` : "Earlier"}
                  >
                    <ChevronLeftIcon className="size-5" aria-hidden="true" />
                    Earlier
                  </button>
                  <button
                    type="button"
                    onClick={goLater}
                    disabled={index <= 0}
                    className="btn-text"
                    aria-label={index > 0 ? `Later date: ${active[index - 1].title}` : "Later"}
                  >
                    Later
                    <ChevronRightIcon className="size-5" aria-hidden="true" />
                  </button>
                </nav>

                {isAdmin && (
                  <div className="flex flex-wrap items-center justify-center gap-1 rounded-xl bg-surface/92 px-1">
                    <button type="button" className="btn-text" onClick={() => setEditing({ plan: blankPlan, isNew: true })}>
                      <PlusIcon className="size-5" aria-hidden="true" />
                      New date
                    </button>
                    <button type="button" className="btn-text" onClick={() => setEditing({ plan, isNew: false })}>
                      <PencilSquareIcon className="size-5" aria-hidden="true" />
                      Edit
                    </button>
                    <button type="button" className="btn-text" onClick={startDelete}>
                      <TrashIcon className="size-5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <footer className="px-4 pb-20 text-center md:pb-6">
        <p className="mx-auto w-fit rounded-full bg-surface/92 px-3 py-1 text-sm text-muted">
          Kicsi's Date Night {VERSION}
        </p>
      </footer>

      {editing && (
        <EditModal
          key={editing.isNew ? "new" : editing.plan.id}
          plan={editing.plan}
          isNew={editing.isNew}
          onSave={(saved) => save(saved, editing.isNew)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        message={`Delete "${plan?.title ?? ""}"? You can't undo this.`}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={deleteCurrent}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={lastPlanNotice}
        message="You can't delete the last date. Add a new one first."
        confirmLabel="OK"
        onConfirm={() => setLastPlanNotice(false)}
        onCancel={() => setLastPlanNotice(false)}
      />
    </div>
  );
}
