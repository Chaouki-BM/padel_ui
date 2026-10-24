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
import { useClubContextStore } from "@/stores/club-context";
import {
  type ClubDashboard,
  type ClubManagedCourt,
  type ClubManagedEvent,
  type ClubManagedPlayer,
  type ClubOffer,
  type ClubRecentReservation,
} from "@/types";
import { type LevelCode } from "@/lib/constants";

export type MyClub = {
  id: string;
  name: string;
  slug: string;
  city: string;
};

export async function getMyClubs(): Promise<MyClub[]> {
  const payload = await apiFetch<unknown>("/my/clubs");
  return unwrapList(payload).map((item) => {
    const raw = asRecord(item);
    return {
      id: asString(raw.id),
      name: asString(raw.name, "Club"),
      slug: asString(raw.slug),
      city: asString(raw.city),
    };
  });
}

export async function resolveClubId(): Promise<string> {
  const clubs = await getMyClubs();
  if (clubs.length === 0) {
    throw new Error("no_managed_club");
  }
  const stored = useClubContextStore.getState().activeClubId;
  if (stored && clubs.some((c) => c.id === stored)) {
    return stored;
  }
  useClubContextStore.getState().setActiveClubId(clubs[0].id);
  return clubs[0].id;
}

function mapCourt(rawUnknown: unknown): ClubManagedCourt {
  const raw = asRecord(rawUnknown);
  const active = asBoolean(raw.active, asBoolean(raw.isActive, true));
  const blocked = asBoolean(raw.blocked, false);
  let status: ClubManagedCourt["status"] = "available";
  if (blocked || asString(raw.status).toLowerCase() === "maintenance") {
    status = "maintenance";
  } else if (!active) {
    status = "maintenance";
  } else if (asString(raw.status).toLowerCase() === "occupied") {
    status = "occupied";
  }
  return {
    id: asString(raw.id),
    name: asString(raw.name, "Court"),
    type: asString(raw.type, asString(raw.surface, "Padel")),
    status,
    pricePerHour: asNumber(raw.pricePerHour, asNumber(raw.basePrice, 0)),
    bookingsToday: asNumber(raw.bookingsToday, 0),
  };
}

function mapBookingRow(rawUnknown: unknown): ClubRecentReservation {
  const raw = asRecord(rawUnknown);
  const player = asRecord(raw.player);
  const court = asRecord(raw.court);
  const startAt = asString(raw.startAt);
  let timeRange = asString(raw.timeRange);
  if (!timeRange && startAt) {
    const d = new Date(startAt);
    const start = d.toLocaleTimeString("fr-TN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Tunis",
    });
    const endAt = asString(raw.endAt);
    const end = endAt
      ? new Date(endAt).toLocaleTimeString("fr-TN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Tunis",
        })
      : "";
    timeRange = end ? `${start} - ${end}` : start;
  }
  const statusRaw = asString(raw.status, "CONFIRMED").toLowerCase();
  let status: ClubRecentReservation["status"] = "confirmed";
  if (statusRaw.includes("cancel")) status = "cancelled";
  else if (statusRaw.includes("pend") || statusRaw.includes("hold"))
    status = "pending";
  else if (statusRaw.includes("paid") || statusRaw.includes("check"))
    status = "paid";

  return {
    id: asString(raw.id),
    playerId: asString(raw.playerId, asString(player.id)) || undefined,
    playerName: asString(
      raw.playerName,
      asString(player.displayName, asString(player.firstName, "Joueur")),
    ),
    courtName: asString(raw.courtName, asString(court.name, "Court")),
    timeRange,
    status,
    price: asNumber(raw.price, asNumber(raw.amount, 0)),
  };
}

function mapEvent(rawUnknown: unknown): ClubManagedEvent {
  const raw = asRecord(rawUnknown);
  const statusRaw = asString(raw.status, "UPCOMING").toUpperCase();
  let status: ClubManagedEvent["status"] = "upcoming";
  if (statusRaw.includes("LIVE") || statusRaw.includes("PROGRESS"))
    status = "live";
  else if (
    statusRaw.includes("DONE") ||
    statusRaw.includes("COMPLETE") ||
    statusRaw.includes("FINISH")
  )
    status = "done";

  const startAt = asString(raw.startAt);
  return {
    id: asString(raw.id),
    title: asString(raw.title, asString(raw.name, "Événement")),
    date: startAt ? formatTunisDate(startAt).split(",")[0] ?? startAt : asString(raw.date),
    timeRange: asString(raw.timeRange, "—"),
    players: asNumber(
      raw.players,
      asNumber(raw.participantsCount, asNumber(raw.registeredCount, 0)),
    ),
    status,
  };
}

function mapOffer(rawUnknown: unknown): ClubOffer {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id),
    title: asString(raw.title, asString(raw.code, "Promo")),
    discountPercent: asNumber(
      raw.discountPercent,
      asNumber(raw.value, asNumber(raw.percent, 0)),
    ),
    validUntil: asString(raw.validUntil, asString(raw.endsAt, asString(raw.endDate, "—"))),
    active: asBoolean(raw.active, asBoolean(raw.isActive, true)),
  };
}

export async function getClubDashboard(): Promise<ClubDashboard> {
  const clubId = await resolveClubId();
  const clubs = await getMyClubs();
  const club = clubs.find((c) => c.id === clubId) ?? clubs[0];

  const [bookingsPayload, courts] = await Promise.all([
    apiFetch<unknown>(`/clubs/${encodeURIComponent(clubId)}/bookings`).catch(
      () => ({ items: [] }),
    ),
    getClubCourts(),
  ]);

  const bookings = unwrapList(bookingsPayload).map(mapBookingRow);
  const confirmed = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "paid",
  );
  const revenue = confirmed.reduce((s, b) => s + b.price, 0);

  return {
    clubName: club?.name ?? "Club",
    kpis: [
      {
        id: "revenue",
        value: `${revenue} TND`,
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "reservations",
        value: String(bookings.length),
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "players",
        value: String(new Set(bookings.map((b) => b.playerName)).size),
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "occupancy",
        value: `${courts.length} courts`,
        trend: "—",
        trendPositive: true,
      },
    ],
    revenueGoal: 15000,
    revenueSeries: [{ month: "J7", reservations: revenue, shop: 0 }],
    recentReservations: bookings.slice(0, 10),
    agenda: bookings.slice(0, 5).map((b) => ({
      id: b.id,
      title: `${b.playerName} · ${b.courtName}`,
      timeRange: b.timeRange,
      meta: b.status,
      live: b.status === "confirmed" || b.status === "paid",
    })),
    weather: {
      city: club?.city ?? "Tunis",
      temperatureC: 26,
      label: "—",
      ideal: true,
    },
  };
}

export async function getClubCourts(): Promise<ClubManagedCourt[]> {
  const clubId = await resolveClubId();
  try {
    const list = await apiFetch<unknown>(
      `/clubs/${encodeURIComponent(clubId)}/courts`,
    );
    const courts = unwrapList(list);
    if (courts.length > 0) return courts.map(mapCourt);
  } catch {
    // fall through
  }
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}`,
  ).catch(() => ({ courts: [] }));
  const root = asRecord(unwrapOne(payload));
  const nested = Array.isArray(root.courts)
    ? root.courts
    : Array.isArray(root.activeCourts)
      ? root.activeCourts
      : [];
  return nested.map(mapCourt);
}

export async function createCourt(input: {
  name: string;
  type?: string;
}): Promise<ClubManagedCourt> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts`,
    { method: "POST", body: JSON.stringify(input) },
  );
  return mapCourt(unwrapOne(payload));
}

export async function updateCourt(
  courtId: string,
  body: Record<string, unknown>,
): Promise<ClubManagedCourt> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  return mapCourt(unwrapOne(payload));
}

export async function putCourtSchedules(
  courtId: string,
  schedules: Array<{
    weekday: number | string;
    opensAtMin: number;
    closesAtMin: number;
  }>,
): Promise<void> {
  const clubId = await resolveClubId();
  await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}/schedules`,
    { method: "PUT", body: JSON.stringify({ schedules }) },
  );
}

export async function getClubBookings(params?: {
  from?: string;
  to?: string;
  courtId?: string;
}): Promise<ClubRecentReservation[]> {
  const clubId = await resolveClubId();
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.courtId) search.set("courtId", params.courtId);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/bookings${qs ? `?${qs}` : ""}`,
  );
  return unwrapList(payload).map(mapBookingRow);
}

export async function checkInBooking(bookingId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/bookings/${encodeURIComponent(bookingId)}/check-in`,
    { method: "POST" },
  );
}

export async function markNoShow(bookingId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/bookings/${encodeURIComponent(bookingId)}/no-show`,
    { method: "POST" },
  );
}

export async function getClubPlayers(): Promise<ClubManagedPlayer[]> {
  // Privacy: Nest only exposes behaviour per player; derive unique players from bookings
  const bookings = await getClubBookings();
  const byKey = new Map<string, ClubManagedPlayer>();
  const defaultLevel: LevelCode = "P100";
  for (const b of bookings) {
    const key = b.playerId || b.playerName;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        id: key,
        displayName: b.playerName,
        initials: b.playerName.slice(0, 2).toUpperCase(),
        level: defaultLevel,
        bookingsCount: 1,
        lastVisitAt: b.timeRange,
        totalSpent: b.price,
      });
    } else {
      existing.bookingsCount += 1;
      existing.totalSpent += b.price;
    }
  }
  return [...byKey.values()];
}

export async function getClubEvents(): Promise<ClubManagedEvent[]> {
  const clubId = await resolveClubId();
  try {
    const payload = await apiFetch<unknown>(
      `/clubs/${encodeURIComponent(clubId)}/events`,
    );
    return unwrapList(payload).map(mapEvent);
  } catch {
    // Public events filtered by club if club-scoped list is unavailable
    const payload = await apiFetch<unknown>("/events", { skipAuth: true });
    return unwrapList(payload)
      .filter((e) => {
        const raw = asRecord(e);
        return (
          asString(raw.clubId) === clubId ||
          asString(asRecord(raw.club).id) === clubId
        );
      })
      .map(mapEvent);
  }
}

export type CreateClubEventBody = {
  type: "AMERICANO" | "MEXICANO" | "TOURNAMENT";
  title: string;
  startAt: string;
  roundsCount?: number;
  pointsPerMatch?: number;
  maxPlayers?: number;
  bracketSize?: 8 | 16 | 32 | 64;
};

export async function createClubEvent(
  body: CreateClubEventBody,
): Promise<ClubManagedEvent> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return mapEvent(unwrapOne(payload));
}

export async function publishClubEvent(eventId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/publish`,
    { method: "POST" },
  );
}

export async function cancelClubEvent(eventId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/cancel`,
    { method: "POST" },
  );
}

export async function startClubEvent(eventId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/start`,
    { method: "POST" },
  );
}

export async function nextEventRound(eventId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/rounds/next`,
    { method: "POST" },
  );
}

export async function scoreEventMatch(
  eventId: string,
  matchId: string,
  scoreA: number,
  scoreB: number,
): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/matches/${encodeURIComponent(matchId)}/score`,
    {
      method: "POST",
      body: JSON.stringify({ scoreA, scoreB }),
    },
  );
}

export async function getClubOffers(): Promise<ClubOffer[]> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/promotions`,
  );
  return unwrapList(payload).map(mapOffer);
}

export async function createClubPromotion(body: {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxUses?: number;
  minAmount?: number;
}): Promise<ClubOffer> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/promotions`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return mapOffer(unwrapOne(payload));
}

export async function getCancellationPolicy(): Promise<Record<string, unknown>> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/cancellation-policy`,
  );
  return asRecord(unwrapOne(payload));
}

export async function putCancellationPolicy(
  body: Record<string, unknown>,
): Promise<void> {
  const clubId = await resolveClubId();
  await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/cancellation-policy`,
    { method: "PUT", body: JSON.stringify(body) },
  );
}

/** Helper for schedule UI: Mon–Sun 8h–22h */
export function defaultWeekSchedules() {
  return [1, 2, 3, 4, 5, 6, 7].map((weekday) => ({
    weekday,
    opensAtMin: 8 * 60,
    closesAtMin: 22 * 60,
  }));
}

export async function patchMyClub(
  body: Record<string, unknown>,
): Promise<MyClub> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  const raw = asRecord(unwrapOne(payload));
  return {
    id: asString(raw.id, clubId),
    name: asString(raw.name, "Club"),
    slug: asString(raw.slug),
    city: asString(raw.city),
  };
}

export type CourtPriceRule = {
  weekday?: number | string;
  fromMin?: number;
  toMin?: number;
  price: number;
  startsOn?: string;
  endsOn?: string;
  label?: string;
};

export async function putCourtPriceRules(
  courtId: string,
  rules: CourtPriceRule[],
): Promise<void> {
  const clubId = await resolveClubId();
  await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}/price-rules`,
    { method: "PUT", body: JSON.stringify({ rules }) },
  );
}

export type BlockedSlot = {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  overlappingBookings: number;
};

export async function getBlockedSlots(
  courtId: string,
): Promise<BlockedSlot[]> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}/blocked-slots`,
  );
  return unwrapList(payload).map((item) => {
    const raw = asRecord(item);
    return {
      id: asString(raw.id),
      startsAt: asString(raw.startsAt, asString(raw.startAt)),
      endsAt: asString(raw.endsAt, asString(raw.endAt)),
      reason: asString(raw.reason, "—"),
      overlappingBookings: asNumber(raw.overlappingBookings, 0),
    };
  });
}

export async function createBlockedSlot(
  courtId: string,
  body: { startsAt: string; endsAt: string; reason?: string },
): Promise<BlockedSlot> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}/blocked-slots`,
    { method: "POST", body: JSON.stringify(body) },
  );
  const raw = asRecord(unwrapOne(payload));
  return {
    id: asString(raw.id),
    startsAt: asString(raw.startsAt, body.startsAt),
    endsAt: asString(raw.endsAt, body.endsAt),
    reason: asString(raw.reason, body.reason ?? "—"),
    overlappingBookings: asNumber(raw.overlappingBookings, 0),
  };
}

export async function deleteBlockedSlot(
  courtId: string,
  slotId: string,
): Promise<void> {
  const clubId = await resolveClubId();
  await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/courts/${encodeURIComponent(courtId)}/blocked-slots/${encodeURIComponent(slotId)}`,
    { method: "DELETE" },
  );
}

export type PlayerBehaviour = {
  playerId: string;
  bookingsCount: number;
  noShows: number;
  cancellations: number;
  status: string;
};

export async function getPlayerBehaviour(
  playerId: string,
): Promise<PlayerBehaviour> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/players/${encodeURIComponent(playerId)}/behaviour`,
  );
  const raw = asRecord(unwrapOne(payload));
  return {
    playerId: asString(raw.playerId, playerId),
    bookingsCount: asNumber(raw.bookingsCount, asNumber(raw.bookings, 0)),
    noShows: asNumber(raw.noShows, 0),
    cancellations: asNumber(raw.cancellations, 0),
    status: asString(raw.status, "OK"),
  };
}

export async function updateClubPromotion(
  promotionId: string,
  body: Record<string, unknown>,
): Promise<ClubOffer> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/promotions/${encodeURIComponent(promotionId)}`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return mapOffer(unwrapOne(payload));
}

export async function patchClubEvent(
  eventId: string,
  body: Record<string, unknown>,
): Promise<ClubManagedEvent> {
  const clubId = await resolveClubId();
  const payload = await apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  return mapEvent(unwrapOne(payload));
}

export async function createEventWalkInTeam(
  eventId: string,
  body: { name?: string; playerIds?: string[] },
): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/teams`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function startEventGroups(
  eventId: string,
  groupsCount?: number,
): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/groups/start`,
    {
      method: "POST",
      body: JSON.stringify(groupsCount ? { groupsCount } : {}),
    },
  );
}

export async function startEventBracket(
  eventId: string,
  fromGroups = false,
): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/bracket/start`,
    {
      method: "POST",
      body: JSON.stringify(fromGroups ? { fromGroups: true } : {}),
    },
  );
}

export async function advanceEventBracket(eventId: string): Promise<unknown> {
  const clubId = await resolveClubId();
  return apiFetch<unknown>(
    `/clubs/${encodeURIComponent(clubId)}/events/${encodeURIComponent(eventId)}/bracket/next`,
    { method: "POST" },
  );
}
