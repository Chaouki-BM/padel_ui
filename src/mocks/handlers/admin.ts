import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";

let promoSeq = 1;
let sponsorSeq = 1;
let clubSeq = 100;

const settingsStore: Record<string, unknown> = {
  commissions: { booking: 10, coaching: 15 },
  bookingRules: { minLeadMinutes: 60 },
  sanctionsLadder: ["WARN", "TEMP_BAN", "BLOCK"],
};

export const adminHandlers = [
  // Legacy
  http.get("*/api/admin/dashboard", () => {
    return HttpResponse.json({ data: db.adminDashboard });
  }),
  http.get("*/api/admin/users", () => {
    return HttpResponse.json({ data: db.adminUsers });
  }),
  http.get("*/api/admin/clubs", () => {
    return HttpResponse.json({ data: db.adminClubs });
  }),
  http.get("*/api/admin/payments", () => {
    return HttpResponse.json({ data: db.adminPayments });
  }),
  http.get("*/api/admin/complaints", () => {
    return HttpResponse.json({ data: db.adminComplaints });
  }),
  http.get("*/api/admin/sponsors", () => {
    return HttpResponse.json({ data: db.sponsorDashboard });
  }),

  // Nest
  http.get("*/api/v1/admin/stats", () =>
    HttpResponse.json({
      ...db.adminDashboard,
      usersTotal: 1240,
      clubsTotal: db.adminClubs.length,
      revenueMonth: 45200,
      sanctionsActive: 3,
    }),
  ),

  http.get("*/api/v1/admin/finance", () =>
    HttpResponse.json({
      volume: 120000,
      commissions: 12000,
      refunds: 800,
      partnerShare: 4000,
      growthSeries: db.adminDashboard.growthSeries,
    }),
  ),

  http.get("*/api/v1/admin/users", () =>
    HttpResponse.json({ items: db.adminUsers }),
  ),

  http.get("*/api/v1/admin/clubs", () =>
    HttpResponse.json({ items: db.adminClubs }),
  ),

  http.post("*/api/v1/admin/clubs", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const club = {
      id: `admin-club-${clubSeq++}`,
      name: String(body.name ?? "Club"),
      city: String(body.city ?? "Tunis"),
      courts: 2,
      status: "pending" as const,
      revenueMonth: 0,
    };
    db.adminClubs.push(club);
    return HttpResponse.json(club, { status: 201 });
  }),

  http.patch("*/api/v1/admin/clubs/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as Record<string, unknown>;
    const idx = db.adminClubs.findIndex((c) => c.id === id);
    if (idx < 0) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    const current = db.adminClubs[idx];
    let status = current.status;
    if (typeof body.isActive === "boolean") {
      status = body.isActive ? "active" : "suspended";
    }
    if (typeof body.status === "string") {
      status = body.status as typeof status;
    }
    const next = {
      ...current,
      name: typeof body.name === "string" ? body.name : current.name,
      status,
    };
    db.adminClubs[idx] = next;
    return HttpResponse.json(next);
  }),

  http.post("*/api/v1/admin/clubs/:id/managers", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ok: true, ...(body as object) }, { status: 201 });
  }),

  http.delete("*/api/v1/admin/clubs/:id/managers/:userId", () =>
    HttpResponse.json({ ok: true }),
  ),

  http.get("*/api/v1/admin/payments", () =>
    HttpResponse.json({ items: db.adminPayments }),
  ),

  http.get("*/api/v1/admin/appeals", () =>
    HttpResponse.json({
      items: db.adminComplaints.map((c) => ({
        id: c.id,
        subject: c.subject,
        fromName: c.fromName,
        status: c.status,
        createdAt: c.createdAt,
      })),
    }),
  ),

  http.patch("*/api/v1/admin/appeals/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as { action?: string };
    const idx = db.adminComplaints.findIndex((c) => c.id === id);
    if (idx >= 0) {
      db.adminComplaints[idx] = {
        ...db.adminComplaints[idx],
        status: body.action === "ACCEPT" ? "resolved" : "in_progress",
      };
      return HttpResponse.json(db.adminComplaints[idx]);
    }
    return HttpResponse.json({ id, status: body.action });
  }),

  http.post("*/api/v1/admin/coaches", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: `coach-admin-${Date.now()}`, ...(body as object) },
      { status: 201 },
    );
  }),

  http.patch("*/api/v1/admin/coaches/:id/assess-permission", async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: params.id, ...(body as object) });
  }),

  http.get("*/api/v1/admin/settings", () => HttpResponse.json(settingsStore)),

  http.get("*/api/v1/admin/settings/:key", ({ params }) => {
    const key = String(params.key);
    return HttpResponse.json({ key, value: settingsStore[key] ?? null });
  }),

  http.put("*/api/v1/admin/settings/:key", async ({ params, request }) => {
    const key = String(params.key);
    const body = (await request.json()) as { value?: unknown };
    settingsStore[key] = body.value;
    return HttpResponse.json({ key, value: body.value });
  }),

  http.delete("*/api/v1/admin/settings/:key", ({ params }) => {
    delete settingsStore[String(params.key)];
    return HttpResponse.json({ ok: true });
  }),

  http.get("*/api/v1/admin/promotions", () =>
    HttpResponse.json({
      items: [
        {
          id: "ap-1",
          code: "WELCOME10",
          title: "WELCOME10",
          value: 10,
          discountPercent: 10,
          active: true,
          validUntil: "2026-12-31",
        },
      ],
    }),
  ),

  http.post("*/api/v1/admin/promotions", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: `ap-${promoSeq++}`,
        code: body.code,
        title: body.code,
        value: body.value,
        discountPercent: body.value,
        active: true,
        validUntil: "2026-12-31",
      },
      { status: 201 },
    );
  }),

  http.get("*/api/v1/admin/sponsors", () =>
    HttpResponse.json({ data: db.sponsorDashboard }),
  ),

  http.post("*/api/v1/admin/sponsors", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const partner = {
      id: `sp-${sponsorSeq++}`,
      name: String(body.name ?? "Sponsor"),
      city: String(body.city ?? "Tunis"),
    };
    db.sponsorDashboard.partners.push(partner);
    return HttpResponse.json(partner, { status: 201 });
  }),


  http.post("*/api/v1/admin/players/:id/sanctions", async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: `san-${Date.now()}`, playerId: params.id, ...(body as object) },
      { status: 201 },
    );
  }),

  http.post("*/api/v1/admin/sanctions/:id/lift", ({ params }) =>
    HttpResponse.json({ id: params.id, status: "LIFTED" }),
  ),

  http.patch("*/api/v1/admin/matches/:id/result", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ok: true, ...(body as object) });
  }),

  http.post("*/api/v1/admin/matches/:id/void", ({ params }) =>
    HttpResponse.json({ id: params.id, status: "VOID" }),
  ),

  http.post("*/api/v1/admin/federation/imports", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ dryRun: true, rows: 0, ...(body as object) });
  }),

  http.get("*/api/v1/admin/federation/imports", () =>
    HttpResponse.json({ items: [] }),
  ),
];
