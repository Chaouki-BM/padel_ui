import { unwrapOne } from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import { mapClubAvailability } from "@/services/mappers/public";
import { type ClubAvailability } from "@/types";

export async function getClubAvailability(
  slug: string,
  date: string,
  durationMin = 90,
  courtType = "Padel Double (Standard)",
): Promise<ClubAvailability> {
  const params = new URLSearchParams({
    date,
    durationMin: String(durationMin),
  });
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(slug)}/availability?${params.toString()}`,
    { skipAuth: true },
  );
  return mapClubAvailability(
    unwrapOne(payload),
    slug,
    date,
    durationMin,
    courtType,
  );
}
