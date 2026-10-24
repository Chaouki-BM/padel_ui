import { unwrapList } from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import {
  mapRankingEntry,
  type RankingEntry,
} from "@/services/mappers/public";

export async function getRankings(params?: {
  city?: string;
  take?: number;
}): Promise<RankingEntry[]> {
  const search = new URLSearchParams();
  if (params?.city) search.set("city", params.city);
  if (params?.take) search.set("take", String(params.take));
  const qs = search.toString();
  const payload = await apiFetch<unknown>(`/rankings${qs ? `?${qs}` : ""}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapRankingEntry);
}
