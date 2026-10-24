import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";

let courtSeq = 100;
let eventSeq = 100;
let promoSeq = 100;
let bookingSeq = 100;

const mutableBookings = db.clubDashboard.recentReservations.map((r) => ({
  ...r,
  startAt: new Date().toISOString(),
  endAt: new Date(Date.now() + 90 * 60_000).toISOString(),
}));

function clubIdOrDefault(params: { clubId?: string | readonly string[] }) {
  return String(params.clubId ?? "club-2");
}

export const clubDashboardHandlers = [
  // Legacy FE-only paths (kept for safety)
  http.get("*/api/club-dashboard", () => {
    return HttpResponse.json({ data: db.clubDashboard });
  }),
  http.get("*/api/club-dashboard/courts", () => {
    return HttpResponse.json({ data: db.clubCourts });
  }),
  http.get("*/api/club-dashboard/players", () => {
    return HttpResponse.json({ data: db.clubPlayers });
  }),
  http.get("*/api/club-dashboard/events", () => {
    return HttpResponse.json({ data: db.clubEvents });
  }),
  http.get("*/api/club-dashboard/offers", () => {
    return HttpResponse.json({ data: db.clubOffers });
  }),

  // Nest: club picker
  http.get("*/api/v1/my/clubs", () => {
    const club = db.clubs.find((c) => c.id === "club-2") ?? db.clubs[0];
    return HttpResponse.json([
      {
        id: club.id,
        name: club.name,
        slug: club.slug,
        city: club.city,
      },
    ]);
  }),

  http.get("*/api/v1/clubs/:clubId/courts", () => {
    return HttpResponse.json({ items: db.clubCourts });
  }),

  http.post("*/api/v1/clubs/:clubId/courts", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const court = {
      id: `court-${courtSeq++}`,
      name: String(body.name ?? "Nouveau court"),
      type: String(body.type ?? "Padel"),
      status: "available" as const,
      pricePerHour: Number(body.pricePerHour ?? 80),
      bookingsToday: 0,
    };
    db.clubCourts.push(court);
    return HttpResponse.json(court, { status: 201 });
  }),

  http.patch("*/api/v1/clubs/:clubId/courts/:courtId", async ({ params, request }) => {
    const courtId = String(params.courtId);
    const body = (await request.json()) as Record<string, unknown>;
    const idx = db.clubCourts.findIndex((c) => c.id === courtId);
    if (idx < 0) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    const current = db.clubCourts[idx];
    const active = body.active;
    let status = current.status;
    if (typeof active === "boolean") {
      status = active ? "available" : "maintenance";
    }
    if (typeof body.status === "string") {
      status = body.status as typeof status;
    }
    const next = {
      ...current,
      name: typeof body.name === "string" ? body.name : current.name,
      type: typeof body.type === "string" ? body.type : current.type,
      pricePerHour:
        typeof body.pricePerHour === "number"
          ? body.pricePerHour
          : current.pricePerHour,
      status,
    };
    db.clubCourts[idx] = next;
    return HttpResponse.json(next);
  }),

  http.put("*/api/v1/clubs/:clubId/courts/:courtId/schedules", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.put("*/api/v1/clubs/:clubId/courts/:courtId/price-rules", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/clubs/:clubId/courts/:courtId/blocked-slots", () =>
    HttpResponse.json({ items: [], total: 0 }),
  ),

  http.post("*/api/v1/clubs/:clubId/courts/:courtId/blocked-slots", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: `blocked-${Date.now()}`, ...(body as object), overlappingBookings: 0 }, { status: 201 });
  }),

  http.delete("*/api/v1/clubs/:clubId/courts/:courtId/blocked-slots/:slotId", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/clubs/:clubId/bookings", () => {
    return HttpResponse.json({
      items: mutableBookings.map((b) => ({
        id: b.id,
        playerName: b.playerName,
        courtName: b.courtName,
        timeRange: b.timeRange,
        status: b.status.toUpperCase(),
        price: b.price,
        amount: b.price,
        startAt: b.startAt,
        endAt: b.endAt,
      })),
      total: mutableBookings.length,
    });
  }),

  http.post(
    "*/api/v1/clubs/:clubId/bookings/:bookingId/check-in",
    ({ params }) => {
      const id = String(params.bookingId);
      const row = mutableBookings.find((b) => b.id === id);
      if (row) row.status = "paid";
      return HttpResponse.json({ id, status: "CHECKED_IN" });
    },
  ),

  http.post(
    "*/api/v1/clubs/:clubId/bookings/:bookingId/no-show",
    ({ params }) => {
      const id = String(params.bookingId);
      const row = mutableBookings.find((b) => b.id === id);
      if (row) row.status = "cancelled";
      return HttpResponse.json({ id, status: "NO_SHOW" });
    },
  ),

  http.get("*/api/v1/clubs/:clubId/cancellation-policy", () =>
    HttpResponse.json({
      freeCancelHours: 24,
      partialRefundHours: 6,
      partialRefundPercent: 50,
    }),
  ),

  http.put("*/api/v1/clubs/:clubId/cancellation-policy", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.get("*/api/v1/clubs/:clubId/promotions", () => {
    return HttpResponse.json({
      items: db.clubOffers.map((o) => ({
        id: o.id,
        title: o.title,
        code: o.title,
        discountPercent: o.discountPercent,
        value: o.discountPercent,
        validUntil: o.validUntil,
        endsAt: o.validUntil,
        active: o.active,
        isActive: o.active,
      })),
    });
  }),

  http.post("*/api/v1/clubs/:clubId/promotions", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const offer = {
      id: `promo-${promoSeq++}`,
      title: String(body.code ?? "PROMO"),
      discountPercent:
        body.type === "FIXED"
          ? Number(body.value ?? 0)
          : Number(body.value ?? 10),
      validUntil: new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10),
      active: true,
    };
    db.clubOffers.push(offer);
    return HttpResponse.json(offer, { status: 201 });
  }),

  http.get("*/api/v1/clubs/:clubId/events", () => {
    return HttpResponse.json({ items: db.clubEvents });
  }),

  http.post("*/api/v1/clubs/:clubId/events", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const event = {
      id: `evt-${eventSeq++}`,
      title: String(body.title ?? "Événement"),
      date: String(body.startAt ?? new Date().toISOString()).slice(0, 10),
      timeRange: "—",
      players: 0,
      status: "upcoming" as const,
    };
    db.clubEvents.push(event);
    return HttpResponse.json(event, { status: 201 });
  }),

  http.post("*/api/v1/clubs/:clubId/events/:eventId/publish", ({ params }) =>
    HttpResponse.json({ id: params.eventId, status: "PUBLISHED" }),
  ),
  http.post("*/api/v1/clubs/:clubId/events/:eventId/cancel", ({ params }) => {
    const id = String(params.eventId);
    const evt = db.clubEvents.find((e) => e.id === id);
    if (evt) evt.status = "done";
    return HttpResponse.json({ id, status: "CANCELLED" });
  }),
  http.post("*/api/v1/clubs/:clubId/events/:eventId/start", ({ params }) => {
    const id = String(params.eventId);
    const evt = db.clubEvents.find((e) => e.id === id);
    if (evt) evt.status = "live";
    return HttpResponse.json({ id, status: "LIVE" });
  }),
  http.post("*/api/v1/clubs/:clubId/events/:eventId/rounds/next", () =>
    HttpResponse.json({ ok: true }),
  ),
  http.post(
    "*/api/v1/clubs/:clubId/events/:eventId/matches/:matchId/score",
    async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ ok: true, ...(body as object) });
    },
  ),

  // Walk-in desk booking stub (optional)
  http.post("*/api/v1/clubs/:clubId/bookings", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const row = {
      id: `BK-${bookingSeq++}`,
      playerName: String(body.playerName ?? "Walk-in"),
      courtName: "Court",
      timeRange: "—",
      status: "confirmed" as const,
      price: Number(body.price ?? 80),
      startAt: String(body.startAt ?? new Date().toISOString()),
      endAt: new Date(Date.now() + 90 * 60_000).toISOString(),
    };
    mutableBookings.unshift(row);
    return HttpResponse.json(row, { status: 201 });
  }),

  http.patch("*/api/v1/clubs/:clubId", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: clubIdOrDefault(params),
      name: body.name ?? "Club",
      slug: "demo-club",
      city: body.city ?? "Tunis",
      ...body,
    });
  }),

  http.post("*/api/v1/clubs/:clubId/promotions/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as Record<string, unknown>;
    const idx = db.clubOffers.findIndex((o) => o.id === id);
    if (idx >= 0) {
      db.clubOffers[idx] = {
        ...db.clubOffers[idx],
        active:
          typeof body.active === "boolean"
            ? body.active
            : db.clubOffers[idx].active,
        discountPercent:
          typeof body.value === "number"
            ? body.value
            : db.clubOffers[idx].discountPercent,
      };
      return HttpResponse.json(db.clubOffers[idx]);
    }
    return HttpResponse.json({ id, ...body });
  }),

  http.patch("*/api/v1/clubs/:clubId/events/:eventId", async ({ params, request }) => {
    const id = String(params.eventId);
    const body = (await request.json()) as Record<string, unknown>;
    const evt = db.clubEvents.find((e) => e.id === id);
    if (evt && typeof body.title === "string") {
      evt.title = body.title;
    }
    return HttpResponse.json(evt ?? { id, ...body });
  }),

  http.post("*/api/v1/clubs/:clubId/events/:eventId/teams", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ok: true, ...(body as object) }, { status: 201 });
  }),

  http.post("*/api/v1/clubs/:clubId/events/:eventId/groups/start", () =>
    HttpResponse.json({ ok: true, groups: 4 }),
  ),

  http.post("*/api/v1/clubs/:clubId/events/:eventId/bracket/start", () =>
    HttpResponse.json({ ok: true, bracket: true }),
  ),

  http.post("*/api/v1/clubs/:clubId/events/:eventId/bracket/next", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/clubs/:clubId/players/:playerId/behaviour", ({ params }) =>
    HttpResponse.json({
      playerId: params.playerId,
      bookingsCount: 12,
      noShows: 1,
      cancellations: 2,
      status: "OK",
    }),
  ),
];
