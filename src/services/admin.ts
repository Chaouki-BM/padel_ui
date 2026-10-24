import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";
import {
  type AdminClubRow,
  type AdminComplaint,
  type AdminDashboard,
  type AdminPaymentRow,
  type AdminUser,
  type SponsorDashboard,
} from "@/types";

function mapUser(rawUnknown: unknown): AdminUser {
  const raw = asRecord(rawUnknown);
  const role = asString(raw.role, "PLAYER").toLowerCase();
  let mappedRole: AdminUser["role"] = "player";
  if (role.includes("admin")) mappedRole = "admin";
  else if (role.includes("club")) mappedRole = "club_manager";
  else if (role.includes("coach")) mappedRole = "coach";

  const statusRaw = asString(raw.status, "active").toLowerCase();
  let status: AdminUser["status"] = "active";
  if (
    statusRaw.includes("sanction") ||
    statusRaw.includes("suspend") ||
    statusRaw.includes("block")
  )
    status = "sanctioned";
  else if (statusRaw.includes("inact") || statusRaw.includes("pend"))
    status = "inactive";

  return {
    id: asString(raw.id),
    displayName: asString(
      raw.displayName,
      `${asString(raw.firstName)} ${asString(raw.lastName)}`.trim() || "User",
    ),
    email: asString(raw.email),
    role: mappedRole,
    roleLabel: asString(raw.roleLabel, mappedRole),
    status,
    reliability: asNumber(raw.reliability, 100),
  };
}

function mapClub(rawUnknown: unknown): AdminClubRow {
  const raw = asRecord(rawUnknown);
  const statusRaw = asString(raw.status, "active").toLowerCase();
  let status: AdminClubRow["status"] = "active";
  if (statusRaw.includes("suspend") || !asBoolean(raw.isActive, true))
    status = "suspended";
  else if (statusRaw.includes("pend")) status = "pending";

  return {
    id: asString(raw.id),
    name: asString(raw.name, "Club"),
    city: asString(raw.city),
    courts: asNumber(raw.courts, asNumber(raw.courtsCount, 0)),
    status,
    revenueMonth: asNumber(raw.revenueMonth, 0),
  };
}

function mapPayment(rawUnknown: unknown): AdminPaymentRow {
  const raw = asRecord(rawUnknown);
  const statusRaw = asString(raw.status, "success").toLowerCase();
  let status: AdminPaymentRow["status"] = "success";
  if (statusRaw.includes("fail")) status = "failed";
  else if (statusRaw.includes("flag")) status = "flagged";
  else if (statusRaw.includes("pend")) status = "pending";

  return {
    id: asString(raw.id),
    label: asString(raw.label, asString(raw.type, "Paiement")),
    userName: asString(raw.userName, asString(raw.payerName, "—")),
    amount: asNumber(raw.amount, 0),
    status,
    date: asString(raw.date, asString(raw.createdAt, "—")),
  };
}

function mapComplaint(rawUnknown: unknown): AdminComplaint {
  const raw = asRecord(rawUnknown);
  const statusRaw = asString(raw.status, "open").toLowerCase();
  let status: AdminComplaint["status"] = "open";
  if (statusRaw.includes("resolv") || statusRaw.includes("accept"))
    status = "resolved";
  else if (statusRaw.includes("progress") || statusRaw.includes("review"))
    status = "in_progress";

  return {
    id: asString(raw.id),
    subject: asString(raw.subject, asString(raw.reason, "Appel")),
    fromName: asString(
      raw.fromName,
      asString(asRecord(raw.player).displayName, "Joueur"),
    ),
    status,
    createdAt: asString(raw.createdAt, asString(raw.timeAgo, "—")),
  };
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  try {
    const payload = await apiFetch<unknown>("/admin/stats");
    const raw = asRecord(unwrapOne(payload));
    const kpisRaw = Array.isArray(raw.kpis) ? raw.kpis : [];
    return {
      kpis:
        kpisRaw.length > 0
          ? kpisRaw.map((k) => {
              const row = asRecord(k);
              return {
                id: asString(row.id, "kpi"),
                value: asString(row.value, String(asNumber(row.value))),
                trend: asString(row.trend, "—"),
                trendPositive: asBoolean(row.trendPositive, true),
              };
            })
          : [
              {
                id: "users",
                value: String(asNumber(raw.usersTotal, asNumber(raw.users, 0))),
                trend: "—",
                trendPositive: true,
              },
              {
                id: "clubs",
                value: String(asNumber(raw.clubsTotal, asNumber(raw.clubs, 0))),
                trend: "—",
                trendPositive: true,
              },
              {
                id: "revenue",
                value: `${asNumber(raw.revenueMonth, asNumber(raw.revenue, 0))} TND`,
                trend: "—",
                trendPositive: true,
              },
              {
                id: "sanctions",
                value: String(asNumber(raw.sanctionsActive, 0)),
                trend: "—",
                trendPositive: false,
              },
            ],
      growthSeries: Array.isArray(raw.growthSeries)
        ? raw.growthSeries.map((p) => {
            const row = asRecord(p);
            return {
              month: asString(row.month, asString(row.label, "—")),
              revenue: asNumber(row.revenue, 0),
              reservations: asNumber(row.reservations, 0),
            };
          })
        : [],
      activities: Array.isArray(raw.activities)
        ? raw.activities.map((a) => {
            const row = asRecord(a);
            const typeRaw = asString(row.type, "system");
            const type = (
              ["club", "payment", "users", "sanction", "system"].includes(
                typeRaw,
              )
                ? typeRaw
                : "system"
            ) as AdminDashboard["activities"][number]["type"];
            return {
              id: asString(row.id),
              type,
              title: asString(row.title),
              description: asString(row.description),
              timeAgo: asString(row.timeAgo, asString(row.createdAt, "—")),
            };
          })
        : [],
      recentUsers: unwrapList(raw.recentUsers).map(mapUser),
      systemUptime: asString(raw.systemUptime, "99.9%"),
    };
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/dashboard");
    const raw = asRecord(unwrapOne(payload));
    return raw as unknown as AdminDashboard;
  }
}

export async function getAdminFinance(params?: {
  from?: string;
  to?: string;
}): Promise<Record<string, unknown>> {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const qs = search.toString();
  const payload = await apiFetch<unknown>(
    `/admin/finance${qs ? `?${qs}` : ""}`,
  );
  return asRecord(unwrapOne(payload));
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const payload = await apiFetch<unknown>("/admin/users");
    return unwrapList(payload).map(mapUser);
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/users");
    return unwrapList(payload).map(mapUser);
  }
}

export async function getAdminClubs(): Promise<AdminClubRow[]> {
  try {
    const payload = await apiFetch<unknown>("/admin/clubs");
    return unwrapList(payload).map(mapClub);
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/clubs");
    return unwrapList(payload).map(mapClub);
  }
}

export async function getAdminPayments(): Promise<AdminPaymentRow[]> {
  try {
    const payload = await apiFetch<unknown>("/admin/payments");
    return unwrapList(payload).map(mapPayment);
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/payments");
    return unwrapList(payload).map(mapPayment);
  }
}

export async function getAdminComplaints(): Promise<AdminComplaint[]> {
  try {
    const payload = await apiFetch<unknown>("/admin/appeals");
    return unwrapList(payload).map(mapComplaint);
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/complaints");
    return unwrapList(payload).map(mapComplaint);
  }
}

export async function getSponsorDashboard(): Promise<SponsorDashboard> {
  try {
    const payload = await apiFetch<unknown>("/admin/sponsors");
    const raw = asRecord(unwrapOne(payload));
    if (Array.isArray(raw.campaigns) || Array.isArray(raw.kpis)) {
      return raw as unknown as SponsorDashboard;
    }
    // list of sponsors only — synthesize minimal dashboard
    const items = unwrapList(payload);
    return {
      kpis: [
        {
          id: "sponsors",
          value: String(items.length),
          trend: "—",
          trendPositive: true,
        },
      ],
      performanceSeries: [],
      campaigns: [],
      partners: items.map((s) => {
        const row = asRecord(s);
        return {
          id: asString(row.id),
          name: asString(row.name, "Sponsor"),
          city: asString(row.city, "—"),
        };
      }),
      tips: [],
    };
  } catch {
    const payload = await apiFetch<unknown>("/api/admin/sponsors");
    return asRecord(unwrapOne(payload)) as unknown as SponsorDashboard;
  }
}

export async function createAdminClub(body: {
  name: string;
  city: string;
  slug?: string;
}): Promise<AdminClubRow> {
  const payload = await apiFetch<unknown>("/admin/clubs", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapClub(unwrapOne(payload));
}

export async function patchAdminClub(
  id: string,
  body: Record<string, unknown>,
): Promise<AdminClubRow> {
  const payload = await apiFetch<unknown>(
    `/admin/clubs/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  return mapClub(unwrapOne(payload));
}

export async function createAdminCoach(body: {
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
}): Promise<unknown> {
  return apiFetch<unknown>("/admin/coaches", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function patchCoachAssessPermission(
  coachId: string,
  allowed: boolean,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/coaches/${encodeURIComponent(coachId)}/assess-permission`,
    { method: "PATCH", body: JSON.stringify({ allowed }) },
  );
}

export async function resolveAppeal(
  appealId: string,
  accept: boolean,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/appeals/${encodeURIComponent(appealId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ action: accept ? "ACCEPT" : "REJECT" }),
    },
  );
}

export async function getAdminSettings(): Promise<Record<string, unknown>> {
  const payload = await apiFetch<unknown>("/admin/settings");
  return asRecord(unwrapOne(payload));
}

export async function putAdminSetting(
  key: string,
  value: unknown,
): Promise<unknown> {
  return apiFetch<unknown>(`/admin/settings/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}

export async function createAdminPromotion(body: {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
}): Promise<unknown> {
  return apiFetch<unknown>("/admin/promotions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createAdminSponsor(body: {
  name: string;
  city?: string;
}): Promise<unknown> {
  return apiFetch<unknown>("/admin/sponsors", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function addClubManager(
  clubId: string,
  userIdOrEmail: string,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/clubs/${encodeURIComponent(clubId)}/managers`,
    {
      method: "POST",
      body: JSON.stringify(
        userIdOrEmail.includes("@")
          ? { email: userIdOrEmail }
          : { userId: userIdOrEmail },
      ),
    },
  );
}

export async function removeClubManager(
  clubId: string,
  userId: string,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/clubs/${encodeURIComponent(clubId)}/managers/${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );
}

export async function patchAdminMatchResult(
  matchId: string,
  body: { scoreA: number; scoreB: number; note?: string },
): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/matches/${encodeURIComponent(matchId)}/result`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
}

export async function voidAdminMatch(matchId: string): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/matches/${encodeURIComponent(matchId)}/void`,
    { method: "POST" },
  );
}

export type FederationImportRow = {
  id: string;
  fileName: string;
  dryRun: boolean;
  createdAt: string;
  rows: number;
  status: string;
};

export async function listFederationImports(): Promise<FederationImportRow[]> {
  const payload = await apiFetch<unknown>("/admin/federation/imports");
  return unwrapList(payload).map((item) => {
    const raw = asRecord(item);
    return {
      id: asString(raw.id),
      fileName: asString(raw.fileName, asString(raw.name, "import.xlsx")),
      dryRun: asBoolean(raw.dryRun, false),
      createdAt: asString(raw.createdAt, "—"),
      rows: asNumber(raw.rows, asNumber(raw.rowCount, 0)),
      status: asString(raw.status, "DONE"),
    };
  });
}

export async function createFederationImport(body: {
  dryRun?: boolean;
  fileName?: string;
}): Promise<unknown> {
  return apiFetch<unknown>("/admin/federation/imports", {
    method: "POST",
    body: JSON.stringify({
      dryRun: body.dryRun ?? true,
      fileName: body.fileName ?? "licences.xlsx",
    }),
  });
}

export async function deleteAdminSetting(key: string): Promise<unknown> {
  return apiFetch<unknown>(`/admin/settings/${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
}

export async function getAdminPromotions(): Promise<
  Array<{ id: string; title: string; discountPercent: number; active: boolean; validUntil: string }>
> {
  try {
    const payload = await apiFetch<unknown>("/admin/promotions");
    return unwrapList(payload).map((item) => {
      const raw = asRecord(item);
      return {
        id: asString(raw.id),
        title: asString(raw.title, asString(raw.code, "Promo")),
        discountPercent: asNumber(raw.discountPercent, asNumber(raw.value, 0)),
        active: asBoolean(raw.active, asBoolean(raw.isActive, true)),
        validUntil: asString(raw.validUntil, asString(raw.endsAt, "—")),
      };
    });
  } catch {
    return [];
  }
}

export async function createPlayerSanction(input: {
  playerId: string;
  type: string;
  reason?: string;
}): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/players/${encodeURIComponent(input.playerId)}/sanctions`,
    {
      method: "POST",
      body: JSON.stringify({ type: input.type, reason: input.reason }),
    },
  );
}

export async function liftSanction(sanctionId: string): Promise<unknown> {
  return apiFetch<unknown>(
    `/admin/sanctions/${encodeURIComponent(sanctionId)}/lift`,
    { method: "POST" },
  );
}
