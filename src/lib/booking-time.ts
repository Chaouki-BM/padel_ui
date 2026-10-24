import { hmToMinutes } from "@/lib/time";

/** Tunisia has no DST — fixed +01:00. */
const TUNIS_OFFSET = "+01:00";

export function buildStartAt(dateKey: string, startTimeHm: string): string {
  const hm = startTimeHm.slice(0, 5);
  return `${dateKey}T${hm}:00${TUNIS_OFFSET}`;
}

export function durationFromSlot(
  startTimeHm: string,
  endTimeHm: string,
  fallback = 90,
): number {
  try {
    const start = hmToMinutes(startTimeHm.slice(0, 5));
    const end = hmToMinutes(endTimeHm.slice(0, 5));
    const diff = end - start;
    if (diff === 60 || diff === 90 || diff === 120) return diff;
    if (diff > 0) return diff;
  } catch {
    // fall through
  }
  return fallback;
}
