import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { formatTunisDate } from "@/lib/format";
import { apiFetch } from "@/services/api";

export type MyMatch = {
  id: string;
  status: string;
  awaitingMyAnswer: boolean;
  scoreA: number | null;
  scoreB: number | null;
  startAt: string;
  label: string;
  dateLabel: string;
};

export type RatingHistoryItem = {
  id: string;
  delta: number;
  rating: number;
  reason: string;
  createdAt: string;
};

function mapMyMatch(rawUnknown: unknown): MyMatch {
  const raw = asRecord(rawUnknown);
  const startAt = asString(raw.startAt, asString(raw.playedAt));
  return {
    id: asString(raw.id),
    status: asString(raw.status, "PENDING").toUpperCase(),
    awaitingMyAnswer: asBoolean(
      raw.awaitingMyAnswer,
      asBoolean(raw.needsResponse, false),
    ),
    scoreA:
      raw.scoreA === null || raw.scoreA === undefined
        ? null
        : asNumber(raw.scoreA),
    scoreB:
      raw.scoreB === null || raw.scoreB === undefined
        ? null
        : asNumber(raw.scoreB),
    startAt,
    label: asString(raw.label, asString(raw.clubName, "Match")),
    dateLabel: startAt ? formatTunisDate(startAt) : "—",
  };
}

export async function getMyMatches(): Promise<MyMatch[]> {
  const payload = await apiFetch<unknown>("/me/matches");
  return unwrapList(payload).map(mapMyMatch);
}

export async function respondToMatch(
  id: string,
  action: "CONFIRM" | "CONTEST",
  note?: string,
): Promise<unknown> {
  return apiFetch<unknown>(`/matches/${encodeURIComponent(id)}/respond`, {
    method: "POST",
    body: JSON.stringify(note ? { action, note } : { action }),
  });
}

export async function getRatingHistory(): Promise<RatingHistoryItem[]> {
  const payload = await apiFetch<unknown>("/me/rating-history");
  return unwrapList(payload).map((item, i) => {
    const raw = asRecord(item);
    return {
      id: asString(raw.id, `rh-${i}`),
      delta: asNumber(raw.delta, asNumber(raw.change, 0)),
      rating: asNumber(raw.rating, asNumber(raw.newRating, 0)),
      reason: asString(raw.reason, asString(raw.label, "—")),
      createdAt: asString(raw.createdAt),
    };
  });
}

export async function getMatchById(id: string): Promise<MyMatch> {
  const payload = await apiFetch<unknown>(`/matches/${encodeURIComponent(id)}`);
  return mapMyMatch(unwrapOne(payload));
}
