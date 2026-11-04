import { useEffect, useRef, useState } from "react";
import type { DatePlan } from "../types/DatePlan";
import { formatOpensAt, formatPlanDate, type SealState } from "../lib/plans";
import { BreakableSeal } from "./SealMark";
import Emphasis from "./Emphasis";

interface InvitationProps {
  plan: DatePlan;
  state: SealState;
  /** Every plan is in the past, so this is the most recent one. */
  isLastTime: boolean;
  isAdmin: boolean;
  onBreak: (id: string) => void;
}

const BREAK_MS = 450;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Invitation({ plan, state, isLastTime, isAdmin, onBreak }: InvitationProps) {
  const [breaking, setBreaking] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [broke, setBroke] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // After the seal breaks, move focus to the title so keyboard and screen reader users land on the plan.
  useEffect(() => {
    if (state === "open" && broke) titleRef.current?.focus();
  }, [state, broke]);

  const breakSeal = () => {
    if (breaking) return;
    setBroke(true);
    setBreaking(true);
    timer.current = setTimeout(() => onBreak(plan.id), prefersReducedMotion() ? 0 : BREAK_MS);
  };

  const date = formatPlanDate(plan.date);

  if (state !== "open") {
    const locked = state === "locked";
    return (
      <article aria-labelledby="invite-date" className="rounded-[20px] bg-surface p-6 text-center shadow-sheet md:p-8">
        <p id="invite-date" className="text-lg italic font-semibold text-muted">
          {date}
        </p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">A little hint</p>
        <p className="mt-1 text-[22px] leading-snug [overflow-wrap:anywhere]">
          {plan.hint ? <Emphasis text={plan.hint} /> : `Something is planned for ${date}.`}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          {locked ? (
            <>
              <span className="seal-button inline-flex size-[72px] items-center justify-center opacity-60">
                <BreakableSeal broken={false} />
              </span>
              <p className="font-semibold">Opens {formatOpensAt(plan.opensAt ?? "")}</p>
            </>
          ) : (
            <button
              type="button"
              onClick={breakSeal}
              aria-label="Break the seal"
              className="seal-button inline-flex size-[72px] cursor-pointer items-center justify-center rounded-full hover:-translate-y-px"
            >
              <BreakableSeal broken={breaking} />
            </button>
          )}
          {!locked && <p className="font-semibold text-muted">Break the seal</p>}
        </div>
      </article>
    );
  }

  return (
    <article
      aria-labelledby="invite-title"
      className={`rounded-[20px] bg-surface p-6 shadow-sheet md:p-8 ${broke ? "unfold" : ""}`}
    >
      {(isLastTime || isAdmin) && (
        <p className="mb-3 text-[15px] font-semibold uppercase tracking-wide text-muted">
          {isLastTime ? "Last time" : "Admin view"}
        </p>
      )}
      <h2
        id="invite-title"
        ref={titleRef}
        tabIndex={-1}
        className="text-[28px] font-semibold leading-tight [overflow-wrap:anywhere] focus:outline-none md:text-[34px]"
      >
        <Emphasis text={plan.title} />
      </h2>
      <p className="mt-2 text-lg italic font-semibold text-muted">{date}</p>
      {plan.description && (
        <p className="mt-5 max-w-[60ch] whitespace-pre-line [overflow-wrap:anywhere]">
          <Emphasis text={plan.description} />
        </p>
      )}
      {plan.activities.length > 0 && (
        <>
          <h3 className="mt-6 text-[22px] font-semibold">The plan</h3>
          <ul className="mt-2 max-w-[60ch] list-disc space-y-1 pl-6 marker:text-seal">
            {plan.activities.map((activity, index) => (
              <li key={index} className="[overflow-wrap:anywhere]">
                <Emphasis text={activity} />
              </li>
            ))}
          </ul>
        </>
      )}
      {isLastTime && <p className="mt-8 text-muted italic">The next invitation is still being written.</p>}
    </article>
  );
}
