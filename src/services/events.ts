import { unwrapList, unwrapOne, asRecord, asString } from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import { mapEvent, type PublicEvent } from "@/services/mappers/public";

export async function getEvents(params?: {
  city?: string;
  type?: string;
}): Promise<PublicEvent[]> {
  const search = new URLSearchParams();
  if (params?.city) search.set("city", params.city);
  if (params?.type) search.set("type", params.type);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(`/events${qs ? `?${qs}` : ""}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapEvent);
}

export async function getEventBySlug(slug: string): Promise<PublicEvent> {
  const payload = await apiFetch<unknown>(
    `/events/${encodeURIComponent(slug)}`,
    { skipAuth: true },
  );
  return mapEvent(unwrapOne(payload));
}

export type EventDetailExtras = {
  participants: unknown[];
  standings: unknown;
  teams: unknown;
  groups: unknown;
  bracket: unknown;
};

export async function getEventDetailBundle(
  slug: string,
): Promise<{ event: PublicEvent; extras: EventDetailExtras }> {
  const encoded = encodeURIComponent(slug);
  const [eventRes, standings, teams, groups, bracket] = await Promise.all([
    apiFetch<unknown>(`/events/${encoded}`, { skipAuth: true }),
    apiFetch<unknown>(`/events/${encoded}/standings`, { skipAuth: true }).catch(
      () => null,
    ),
    apiFetch<unknown>(`/events/${encoded}/teams`, { skipAuth: true }).catch(
      () => null,
    ),
    apiFetch<unknown>(`/events/${encoded}/groups`, { skipAuth: true }).catch(
      () => null,
    ),
    apiFetch<unknown>(`/events/${encoded}/bracket`, { skipAuth: true }).catch(
      () => null,
    ),
  ]);

  const root = asRecord(unwrapOne(eventRes));
  return {
    event: mapEvent(root),
    extras: {
      participants: Array.isArray(root.participants) ? root.participants : [],
      standings,
      teams,
      groups,
      bracket,
    },
  };
}

export function eventTypeLabel(type: string): string {
  return asString(type).replace(/_/g, " ");
}

export type EventRegisterResult = {
  status: string;
  paymentId: string | null;
};

export async function registerForEvent(
  slug: string,
  paymentMode?: "CARD" | "ON_SITE",
): Promise<EventRegisterResult> {
  const payload = await apiFetch<unknown>(
    `/events/${encodeURIComponent(slug)}/register`,
    {
      method: "POST",
      body: JSON.stringify(paymentMode ? { paymentMode } : {}),
    },
  );
  const raw = asRecord(unwrapOne(payload));
  return {
    status: asString(raw.status, "REGISTERED").toUpperCase(),
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
  };
}

export async function withdrawFromEvent(slug: string): Promise<void> {
  await apiFetch<unknown>(`/events/${encodeURIComponent(slug)}/withdraw`, {
    method: "POST",
  });
}

export async function createEventTeam(
  slug: string,
  partnerId: string,
  name?: string,
): Promise<unknown> {
  return apiFetch<unknown>(`/events/${encodeURIComponent(slug)}/teams`, {
    method: "POST",
    body: JSON.stringify(name ? { partnerId, name } : { partnerId }),
  });
}
