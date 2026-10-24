import { unwrapList, unwrapOne } from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import { mapClub, mapReviews, type ClubReviewSummary } from "@/services/mappers/public";
import { type Club } from "@/types";

export async function getClubs(params?: {
  city?: string;
  q?: string;
}): Promise<Club[]> {
  const search = new URLSearchParams();
  if (params?.city) search.set("city", params.city);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(`/clubs${qs ? `?${qs}` : ""}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapClub);
}

export async function getClubBySlug(slug: string): Promise<Club> {
  const payload = await apiFetch<unknown>(`/clubs/${encodeURIComponent(slug)}`, {
    skipAuth: true,
  });
  return mapClub(unwrapOne(payload));
}

export async function getClubReviews(slug: string): Promise<ClubReviewSummary> {
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(slug)}/reviews`,
    { skipAuth: true },
  );
  return mapReviews(unwrapOne(payload));
}
