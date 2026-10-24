import {
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import { type LevelCode } from "@/lib/constants";
import { mapOpenMatch } from "@/services/mappers/public";
import { type Match } from "@/types";

export type OpenMatchesResponse = {
  data: Match[];
  total: number;
};

export type CreateOpenMatchBody = {
  clubId?: string;
  startAt?: string;
  bookingId?: string;
  levelMin?: LevelCode;
  levelMax?: LevelCode;
  type: "FRIENDLY" | "COMPETITIVE";
  pricePerPlayer?: number;
  notes?: string;
};

export type OpenMatchResultBody = {
  teamA: [string, string];
  teamB: [string, string];
  scoreA: number;
  scoreB: number;
  kind: "FRIENDLY" | "OFFICIAL";
};

export async function getOpenMatches(params?: {
  city?: string;
  clubId?: string;
  type?: string;
}): Promise<OpenMatchesResponse> {
  const search = new URLSearchParams();
  if (params?.city) search.set("city", params.city);
  if (params?.clubId) search.set("clubId", params.clubId);
  if (params?.type) search.set("type", params.type);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(
    `/open-matches${qs ? `?${qs}` : ""}`,
    { skipAuth: true },
  );

  const list = unwrapList(payload).map(mapOpenMatch);
  const total =
    payload &&
    typeof payload === "object" &&
    typeof (payload as { total?: unknown }).total === "number"
      ? (payload as { total: number }).total
      : list.length;

  return { data: list, total };
}

export async function getOpenMatchById(id: string): Promise<Match> {
  const payload = await apiFetch<unknown>(
    `/open-matches/${encodeURIComponent(id)}`,
    { skipAuth: true },
  );
  return mapOpenMatch(unwrapOne(payload));
}

export async function createOpenMatch(
  body: CreateOpenMatchBody,
): Promise<Match> {
  const payload = await apiFetch<unknown>("/open-matches", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapOpenMatch(unwrapOne(payload));
}

export async function joinOpenMatch(id: string): Promise<Match> {
  const payload = await apiFetch<unknown>(
    `/open-matches/${encodeURIComponent(id)}/join`,
    { method: "POST" },
  );
  return mapOpenMatch(unwrapOne(payload));
}

export async function leaveOpenMatch(id: string): Promise<Match> {
  const payload = await apiFetch<unknown>(
    `/open-matches/${encodeURIComponent(id)}/leave`,
    { method: "POST" },
  );
  return mapOpenMatch(unwrapOne(payload));
}

export async function payOpenMatch(
  id: string,
): Promise<{ paymentId: string | null }> {
  const payload = await apiFetch<unknown>(
    `/open-matches/${encodeURIComponent(id)}/pay`,
    { method: "POST" },
  );
  const raw = asRecord(unwrapOne(payload));
  return {
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
  };
}

export async function cancelOpenMatch(id: string): Promise<Match> {
  const payload = await apiFetch<unknown>(
    `/open-matches/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
  );
  return mapOpenMatch(unwrapOne(payload));
}

export async function submitOpenMatchResult(
  id: string,
  body: OpenMatchResultBody,
): Promise<unknown> {
  return apiFetch<unknown>(`/open-matches/${encodeURIComponent(id)}/result`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
