import { http, HttpResponse } from "msw";

const openMatches = new Map<string, Record<string, unknown>>();
let seq = 1;

export const playHandlers = [
  http.post("*/api/v1/open-matches", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const id = `om-${seq++}`;
    const match = {
      id,
      clubId: body.clubId,
      clubName: "Demo Club",
      clubLocation: "Tunis",
      startAt: body.startAt,
      pricePerPlayer: body.pricePerPlayer ?? 30,
      levelMin: body.levelMin ?? null,
      levelMax: body.levelMax ?? null,
      players: [{ id: "me", displayName: "Moi", level: "P100" }],
      maxPlayers: 4,
      status: "OPEN",
      spotsLeft: 3,
      type: body.type,
    };
    openMatches.set(id, match);
    return HttpResponse.json(match, { status: 201 });
  }),

  http.post("*/api/v1/open-matches/:id/join", ({ params }) => {
    const id = String(params.id);
    const match = openMatches.get(id) ?? {
      id,
      clubName: "Demo Club",
      players: [],
      maxPlayers: 4,
      status: "OPEN",
    };
    const players = Array.isArray(match.players) ? [...match.players] : [];
    players.push({
      id: `p-${seq++}`,
      displayName: "Joueur",
      level: "P100",
    });
    match.players = players;
    if (players.length >= 4) match.status = "FULL";
    openMatches.set(id, match);
    return HttpResponse.json(match);
  }),

  http.post("*/api/v1/open-matches/:id/leave", ({ params }) => {
    const id = String(params.id);
    const match = openMatches.get(id) ?? { id, players: [], status: "OPEN" };
    match.status = "OPEN";
    openMatches.set(id, match);
    return HttpResponse.json(match);
  }),

  http.post("*/api/v1/open-matches/:id/pay", () =>
    HttpResponse.json({ paymentId: `pay-om-${seq++}` }),
  ),

  http.post("*/api/v1/open-matches/:id/cancel", ({ params }) => {
    const id = String(params.id);
    const match = openMatches.get(id) ?? { id };
    match.status = "CANCELLED";
    openMatches.set(id, match);
    return HttpResponse.json(match);
  }),

  http.post("*/api/v1/open-matches/:id/result", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/me/matches", () =>
    HttpResponse.json({
      items: [
        {
          id: "match-1",
          status: "PENDING",
          awaitingMyAnswer: true,
          scoreA: 6,
          scoreB: 4,
          startAt: new Date().toISOString(),
          label: "Match amical",
        },
      ],
    }),
  ),

  http.post("*/api/v1/matches/:id/respond", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/me/rating-history", () =>
    HttpResponse.json({
      items: [
        {
          id: "rh-1",
          delta: 12,
          rating: 1120,
          reason: "Victoire officielle",
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  ),

  http.post("*/api/v1/events/:slug/register", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      paymentMode?: string;
    };
    if (body.paymentMode === "CARD") {
      return HttpResponse.json({
        status: "PENDING",
        paymentId: `pay-evt-${seq++}`,
      });
    }
    return HttpResponse.json({ status: "REGISTERED", paymentId: null });
  }),

  http.post("*/api/v1/events/:slug/withdraw", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.post("*/api/v1/events/:slug/teams", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.post("*/api/v1/coaches/:id/bookings", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: `cb-${seq++}`,
      status: "REQUESTED",
      coachId: "coach-1",
      coachName: "Coach Demo",
      startAt: body.startAt,
      durationMin: body.durationMin,
      price: 80,
    });
  }),

  http.get("*/api/v1/me/coach-bookings", () =>
    HttpResponse.json({ items: [] }),
  ),

  http.post("*/api/v1/me/coach-bookings/:id/cancel", () =>
    HttpResponse.json({ id: "cb-1", status: "CANCELLED" }),
  ),

  http.get("*/api/v1/subscriptions/plans", () =>
    HttpResponse.json([
      {
        id: "plan-1",
        code: "PLAYER_PREMIUM",
        name: "Joueur Premium",
        price: 29,
        interval: "month",
        description: "Réservations prioritaires",
      },
    ]),
  ),

  http.get("*/api/v1/me/subscriptions", () =>
    HttpResponse.json({ items: [] }),
  ),

  http.post("*/api/v1/me/subscriptions", async ({ request }) => {
    const body = (await request.json()) as { plan: string };
    return HttpResponse.json({
      id: `sub-${seq++}`,
      plan: body.plan,
      status: "PENDING",
      paymentId: `pay-sub-${seq++}`,
      renews: true,
    });
  }),

  http.post("*/api/v1/me/subscriptions/:id/cancel", ({ params }) =>
    HttpResponse.json({
      id: String(params.id),
      plan: "PLAYER_PREMIUM",
      status: "CANCELLED",
      renews: false,
    }),
  ),
];
