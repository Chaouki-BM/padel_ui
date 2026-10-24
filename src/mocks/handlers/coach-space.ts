import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";
import { buildCoachSpaceAvailability } from "@/mocks/seed/coach-space";

type MutableBooking = {
  id: string;
  clientName: string;
  playerId: string;
  startAt: string;
  durationMin: number;
  price: number;
  status: string;
  note: string;
};

const bookings: MutableBooking[] = db.coachSpaceRequests.map((r, i) => ({
  id: r.id,
  clientName: r.clientName,
  playerId: `player-${i + 1}`,
  startAt: new Date(Date.now() + i * 86400_000).toISOString(),
  durationMin: r.durationMinutes,
  price: r.price,
  status:
    r.status === "accepted"
      ? "ACCEPTED"
      : r.status === "declined"
        ? "REFUSED"
        : "REQUESTED",
  note: r.message,
}));

let coachProfile = {
  id: db.coachSpaceDashboard.profile.id,
  displayName: db.coachSpaceDashboard.profile.displayName,
  bio: "Coach de padel certifié",
  experienceYears: 8,
  certifications: ["FTT"],
  levelsTaught: ["P100", "P250", "P500"],
  pricePerHour: 60,
  city: db.coachSpaceDashboard.profile.city,
  badge: db.coachSpaceDashboard.profile.badge,
  clubName: db.coachSpaceDashboard.profile.clubName,
  imageUrl: db.coachSpaceDashboard.profile.imageUrl,
  coverUrl: db.coachSpaceDashboard.profile.coverUrl,
  rating: db.coachSpaceDashboard.profile.rating,
  reviewCount: db.coachSpaceDashboard.profile.reviewCount,
  sessionsCoached: db.coachSpaceDashboard.profile.sessionsCoached,
};

let availabilities = [
  { weekday: "MON", fromMin: 18 * 60, toMin: 20 * 60 },
  { weekday: "WED", fromMin: 18 * 60, toMin: 20 * 60 },
  { weekday: "FRI", fromMin: 17 * 60, toMin: 21 * 60 },
];

export const coachSpaceHandlers = [
  // Legacy
  http.get("*/api/coach-space/dashboard", () => {
    return HttpResponse.json({ data: db.coachSpaceDashboard });
  }),
  http.get("*/api/coach-space/requests", () => {
    return HttpResponse.json({ data: db.coachSpaceRequests });
  }),
  http.get("*/api/coach-space/clients", () => {
    return HttpResponse.json({ data: db.coachSpaceClients });
  }),
  http.get("*/api/coach-space/availability", ({ request }) => {
    const url = new URL(request.url);
    const date =
      url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    return HttpResponse.json({
      data: buildCoachSpaceAvailability(date),
    });
  }),
  http.patch("*/api/coach-space/requests/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as { status?: string };
    const index = db.coachSpaceRequests.findIndex((item) => item.id === id);
    if (index < 0) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    const status = body.status;
    if (status === "accepted" || status === "declined") {
      db.coachSpaceRequests[index] = {
        ...db.coachSpaceRequests[index],
        status,
      };
    }
    return HttpResponse.json({ data: db.coachSpaceRequests[index] });
  }),

  // Nest
  http.get("*/api/v1/me/coach/profile", () => HttpResponse.json(coachProfile)),

  http.patch("*/api/v1/me/coach/profile", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    coachProfile = { ...coachProfile, ...body } as typeof coachProfile;
    return HttpResponse.json(coachProfile);
  }),

  http.get("*/api/v1/me/coach/availabilities", () =>
    HttpResponse.json({ items: availabilities }),
  ),

  http.put("*/api/v1/me/coach/availabilities", async ({ request }) => {
    const body = (await request.json()) as {
      availabilities?: typeof availabilities;
    };
    if (Array.isArray(body.availabilities)) {
      availabilities = body.availabilities;
    }
    return HttpResponse.json({ items: availabilities });
  }),

  http.get("*/api/v1/me/coach/bookings", () =>
    HttpResponse.json({ items: bookings }),
  ),

  http.post("*/api/v1/me/coach/bookings/:id/accept", ({ params }) => {
    const id = String(params.id);
    const row = bookings.find((b) => b.id === id);
    if (!row) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    row.status = "ACCEPTED";
    return HttpResponse.json(row);
  }),

  http.post("*/api/v1/me/coach/bookings/:id/refuse", ({ params }) => {
    const id = String(params.id);
    const row = bookings.find((b) => b.id === id);
    if (!row) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    row.status = "REFUSED";
    return HttpResponse.json(row);
  }),

  http.post("*/api/v1/me/coach/bookings/:id/complete", ({ params }) => {
    const id = String(params.id);
    const row = bookings.find((b) => b.id === id);
    if (!row) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    row.status = "COMPLETED";
    return HttpResponse.json(row);
  }),

  http.post("*/api/v1/me/coach/assessments", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ok: true, ...(body as object) }, { status: 201 });
  }),
];
