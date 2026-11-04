import type { DatePlan } from "../types/DatePlan";

export type SealState = "open" | "sealed" | "locked";

const PLAN_DATE = /^(\d{4})\.(\d{2})\.(\d{2})$/;

/** "YYYY.MM.DD" as a local midnight, or null if the string is not in that format. */
export function parsePlanDate(value: string): Date | null {
  const match = PLAN_DATE.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function todayKey(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
}

/** "Sat 18 Apr 2026". Falls back to the raw string if it cannot be parsed. */
export function formatPlanDate(value: string): string {
  const date = parsePlanDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(",", "");
}

/** "Sat 7 Nov, 09:00" */
export function formatOpensAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" })
    .format(date)
    .replace(",", "");
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${day}, ${time}`;
}

/** Newest date first. Stable for equal dates. */
export function sortNewestFirst(plans: DatePlan[]): DatePlan[] {
  return plans
    .map((plan, index) => ({ plan, index }))
    .sort((a, b) => (a.plan.date < b.plan.date ? 1 : a.plan.date > b.plan.date ? -1 : a.index - b.index))
    .map(({ plan }) => plan);
}

export function isPast(plan: DatePlan, now: Date): boolean {
  return plan.date < todayKey(now);
}

/**
 * Index of the plan to show first in a newest-first list: the soonest upcoming date,
 * or the newest plan when every date is in the past.
 */
export function pickCurrentIndex(sorted: DatePlan[], now: Date): number {
  const today = todayKey(now);
  let next = -1;
  sorted.forEach((plan, index) => {
    if (plan.date >= today) next = index;
  });
  return next === -1 ? 0 : next;
}

export function getSealState(plan: DatePlan, now: Date, opened: boolean, isAdmin: boolean): SealState {
  if (isAdmin || isPast(plan, now) || opened) return "open";
  if (plan.opensAt) {
    const opensAt = new Date(plan.opensAt);
    if (!Number.isNaN(opensAt.getTime()) && opensAt.getTime() > now.getTime()) return "locked";
  }
  return "sealed";
}
