import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { minutesToHm } from "@/lib/time";
import { apiFetch } from "@/services/api";
import { mapCoach } from "@/services/mappers/public";
import { type Coach, type CoachAvailability } from "@/types";

export async function getCoaches(params?: { city?: string }): Promise<Coach[]> {
  const search = new URLSearchParams();
  if (params?.city) search.set("city", params.city);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(`/coaches${qs ? `?${qs}` : ""}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapCoach);
}

/** Nest uses UUID; MSW may still use slug — both work as path param. */
export async function getCoachById(id: string): Promise<Coach> {
  const payload = await apiFetch<unknown>(
    `/coaches/${encodeURIComponent(id)}`,
    { skipAuth: true },
  );
  return mapCoach(unwrapOne(payload));
}

/** @deprecated Prefer getCoachById — kept for existing call sites. */
export async function getCoachBySlug(slug: string): Promise<Coach> {
  return getCoachById(slug);
}

function periodFromHm(hm: string): "morning" | "afternoon" | "evening" {
  const hour = Number(hm.slice(0, 2));
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export async function getCoachAvailability(
  id: string,
  date: string,
  sessionMinutes: number,
): Promise<CoachAvailability> {
  const coach = await getCoachById(id);
  const payload = await apiFetch<unknown>(
    `/coaches/${encodeURIComponent(id)}`,
    { skipAuth: true },
  );
  const raw = asRecord(unwrapOne(payload));

  // Prefer dedicated availability if present on profile; else derive from weekly windows.
  const avail = Array.isArray(raw.availabilities)
    ? raw.availabilities
    : Array.isArray(raw.weeklyAvailability)
      ? raw.weeklyAvailability
      : [];

  const weekday = new Date(`${date}T12:00:00`).getDay(); // 0 Sun
  const apiWeekday = weekday === 0 ? 7 : weekday; // some APIs use 1=Mon..7=Sun
  const dayName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][weekday];

  const windows = avail.filter((w) => {
    const row = asRecord(w);
    const wd = row.weekday;
    if (typeof wd === "number") {
      return wd === weekday || wd === apiWeekday;
    }
    return asString(wd).toUpperCase().startsWith(String(dayName).slice(0, 3));
  });

  const slots = windows.flatMap((w, wi) => {
    const row = asRecord(w);
    const from = asNumber(row.fromMin, asNumber(row.opensAtMin, 0));
    const to = asNumber(row.toMin, asNumber(row.closesAtMin, from + sessionMinutes));
    const out = [];
    for (let start = from; start + sessionMinutes <= to; start += sessionMinutes) {
      const startTime = minutesToHm(start);
      const endTime = minutesToHm(start + sessionMinutes);
      out.push({
        id: `${coach.id}-${date}-${start}-${wi}`,
        startTime,
        endTime,
        price: (coach.pricePerHour * sessionMinutes) / 60,
        status: "available" as const,
        period: periodFromHm(startTime),
        discountPercent: null,
      });
    }
    return out;
  });

  return {
    coachId: coach.id,
    coachSlug: coach.slug,
    date,
    sessionMinutes,
    slots,
  };
}
