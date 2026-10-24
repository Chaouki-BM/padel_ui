/** Minutes since midnight ↔ HH:mm (API guide convention). */

export function minutesToHm(minutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.floor(minutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function hmToMinutes(hm: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!match) {
    throw new Error(`Invalid HH:mm: ${hm}`);
  }
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  if (hours > 23 || mins > 59) {
    throw new Error(`Invalid HH:mm: ${hm}`);
  }
  return hours * 60 + mins;
}

/** Prefer Z in query strings so `+` is not decoded as space. */
export function toApiTimestamp(date: Date): string {
  return date.toISOString();
}
