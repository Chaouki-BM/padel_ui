import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { type LevelCode } from "@/lib/constants";
import { formatTunisDate } from "@/lib/format";
import { apiFetch } from "@/services/api";
import { getMe } from "@/services/me";
import {
  type CoachDaySlot,
  type CoachSpaceAvailabilityDay,
  type CoachSpaceClient,
  type CoachSpaceDashboard,
  type CoachSpaceProfile,
  type CoachSpaceRequest,
  type CoachSpaceSession,
} from "@/types";

export type CoachBookingRow = {
  id: string;
  clientName: string;
  clientInitials: string;
  playerId: string;
  startAt: string;
  durationMinutes: number;
  price: number;
  status: "pending" | "accepted" | "declined" | "completed";
  note: string;
};

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function mapBookingStatus(
  raw: string,
): CoachBookingRow["status"] {
  const s = raw.toUpperCase();
  if (s.includes("REQUEST") || s.includes("PEND")) return "pending";
  if (s.includes("REFUS") || s.includes("DECLIN") || s.includes("CANCEL"))
    return "declined";
  if (s.includes("COMPLETE") || s.includes("DONE")) return "completed";
  if (s.includes("ACCEPT") || s.includes("CONFIRM")) return "accepted";
  return "pending";
}

function mapBooking(rawUnknown: unknown): CoachBookingRow {
  const raw = asRecord(rawUnknown);
  const player = asRecord(raw.player);
  const name = asString(
    raw.clientName,
    asString(player.displayName, asString(player.firstName, "Client")),
  );
  const startAt = asString(raw.startAt, new Date().toISOString());
  return {
    id: asString(raw.id),
    clientName: name,
    clientInitials: initials(name),
    playerId: asString(raw.playerId, asString(player.id)),
    startAt,
    durationMinutes: asNumber(raw.durationMin, asNumber(raw.durationMinutes, 60)),
    price: asNumber(raw.price, asNumber(raw.amount, 0)),
    status: mapBookingStatus(asString(raw.status, "REQUESTED")),
    note: asString(raw.note, asString(raw.message)),
  };
}

export async function getCoachBookings(): Promise<CoachBookingRow[]> {
  const payload = await apiFetch<unknown>("/me/coach/bookings");
  return unwrapList(payload).map(mapBooking);
}

function bookingToRequest(b: CoachBookingRow): CoachSpaceRequest {
  const d = new Date(b.startAt);
  return {
    id: b.id,
    clientName: b.clientName,
    clientInitials: b.clientInitials,
    sessionType: "individual",
    preferredDate: formatTunisDate(b.startAt).split(",")[0] ?? b.startAt.slice(0, 10),
    preferredTime: d.toLocaleTimeString("fr-TN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Tunis",
    }),
    durationMinutes: b.durationMinutes,
    message: b.note || "—",
    status:
      b.status === "completed"
        ? "accepted"
        : b.status === "declined"
          ? "declined"
          : b.status === "accepted"
            ? "accepted"
            : "pending",
    price: b.price,
  };
}

function bookingToSession(b: CoachBookingRow): CoachSpaceSession {
  const start = new Date(b.startAt);
  const end = new Date(start.getTime() + b.durationMinutes * 60_000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("fr-TN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Tunis",
    });
  return {
    id: b.id,
    clientName: b.clientName,
    clientInitials: b.clientInitials,
    sessionType: "individual",
    dateLabel: formatTunisDate(b.startAt).split(",")[0] ?? "",
    startTime: fmt(start),
    endTime: fmt(end),
    durationMinutes: b.durationMinutes,
    status:
      b.status === "completed"
        ? "completed"
        : b.status === "pending"
          ? "pending"
          : "confirmed",
  };
}

function meDisplayName(me: Awaited<ReturnType<typeof getMe>> | null): string {
  if (!me) return "Coach";
  const profile = me.profile ? asRecord(me.profile) : {};
  const fromProfile = asString(profile.displayName);
  if (fromProfile) return fromProfile;
  const first = asString(me.firstName);
  const last = asString(me.lastName);
  const combined = `${first} ${last}`.trim();
  return combined || "Coach";
}

async function resolveProfile(
  bookings: CoachBookingRow[],
): Promise<CoachSpaceProfile> {
  const me = await getMe().catch(() => null);
  try {
    const payload = await apiFetch<unknown>("/me/coach/profile");
    const raw = asRecord(unwrapOne(payload));
    if (asString(raw.id) || asString(raw.displayName) || asString(raw.bio)) {
      const name = asString(raw.displayName, meDisplayName(me));
      return {
        id: asString(raw.id, asString(me?.id, "coach")),
        displayName: name,
        badge: asString(raw.badge, "COACH"),
        city: asString(raw.city, "Tunis"),
        clubName: asString(raw.clubName, "—"),
        imageUrl: asString(
          raw.imageUrl,
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
        ),
        coverUrl: asString(
          raw.coverUrl,
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
        ),
        rating: asNumber(raw.rating, 4.8),
        reviewCount: asNumber(raw.reviewCount, 0),
        sessionsCoached: asNumber(
          raw.sessionsCoached,
          bookings.filter((b) => b.status === "completed").length,
        ),
      };
    }
  } catch {
    // fall through
  }
  return {
    id: asString(me?.id, "coach"),
    displayName: meDisplayName(me),
    badge: "COACH",
    city: "Tunis",
    clubName: "—",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
    rating: 4.8,
    reviewCount: 0,
    sessionsCoached: bookings.filter((b) => b.status === "completed").length,
  };
}

export async function getCoachSpaceDashboard(): Promise<CoachSpaceDashboard> {
  const bookings = await getCoachBookings();
  const profile = await resolveProfile(bookings);
  const accepted = bookings.filter(
    (b) => b.status === "accepted" || b.status === "completed",
  );
  const revenue = accepted.reduce((s, b) => s + b.price, 0);
  const clients = new Set(bookings.map((b) => b.clientName)).size;

  return {
    profile,
    kpis: [
      {
        id: "revenue",
        value: `${revenue} TND`,
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "sessions",
        value: String(bookings.length),
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "clients",
        value: String(clients),
        trend: "7j",
        trendPositive: true,
      },
      {
        id: "rating",
        value: profile.rating.toFixed(2),
        trend: "—",
        trendPositive: true,
      },
    ],
    upcomingSessions: bookings
      .filter((b) => b.status !== "declined" && b.status !== "completed")
      .slice(0, 6)
      .map(bookingToSession),
    performance: [
      {
        sessionType: "individual",
        count: bookings.length,
        percent: 100,
      },
    ],
    todaySlots: buildDaySlotsFromBookings(bookings),
    todayLabel: formatTunisDate(new Date().toISOString()).split(",")[0] ?? "",
    alerts: [],
  };
}

function buildDaySlotsFromBookings(bookings: CoachBookingRow[]): CoachDaySlot[] {
  const slots: CoachDaySlot[] = [];
  for (let h = 8; h <= 20; h++) {
    const time = `${String(h).padStart(2, "0")}:00`;
    const occupied = bookings.some((b) => {
      const start = new Date(b.startAt);
      return (
        start.getHours() === h &&
        (b.status === "accepted" || b.status === "pending")
      );
    });
    slots.push({ time, status: occupied ? "occupied" : "free" });
  }
  return slots;
}

export async function getCoachSpaceRequests(): Promise<CoachSpaceRequest[]> {
  const bookings = await getCoachBookings();
  return bookings.map(bookingToRequest);
}

export async function getCoachSpaceClients(): Promise<CoachSpaceClient[]> {
  const bookings = await getCoachBookings();
  const byPlayer = new Map<string, CoachSpaceClient>();
  const defaultLevel: LevelCode = "P100";
  for (const b of bookings) {
    const key = b.playerId || b.clientName;
    const existing = byPlayer.get(key);
    if (!existing) {
      byPlayer.set(key, {
        id: key,
        displayName: b.clientName,
        initials: b.clientInitials,
        level: defaultLevel,
        sessionsCount: 1,
        lastSessionAt: formatTunisDate(b.startAt).split(",")[0] ?? "",
        totalSpent: b.price,
      });
    } else {
      existing.sessionsCount += 1;
      existing.totalSpent += b.price;
      existing.lastSessionAt =
        formatTunisDate(b.startAt).split(",")[0] ?? existing.lastSessionAt;
    }
  }
  return [...byPlayer.values()];
}

export type CoachAvailabilityWindow = {
  weekday: string | number;
  fromMin: number;
  toMin: number;
};

export async function getCoachAvailabilities(): Promise<CoachAvailabilityWindow[]> {
  try {
    const payload = await apiFetch<unknown>("/me/coach/availabilities");
    return unwrapList(payload).map((item) => {
      const raw = asRecord(item);
      return {
        weekday: (raw.weekday as string | number) ?? 1,
        fromMin: asNumber(raw.fromMin, 18 * 60),
        toMin: asNumber(raw.toMin, 20 * 60),
      };
    });
  } catch {
    return [];
  }
}

export async function getCoachSpaceAvailability(
  date: string,
): Promise<CoachSpaceAvailabilityDay> {
  const bookings = await getCoachBookings();
  const dayBookings = bookings.filter((b) => b.startAt.startsWith(date));
  return {
    date,
    slots: buildDaySlotsFromBookings(dayBookings),
  };
}

export async function updateCoachSpaceRequest(
  id: string,
  status: "accepted" | "declined",
): Promise<CoachSpaceRequest> {
  const path =
    status === "accepted"
      ? `/me/coach/bookings/${encodeURIComponent(id)}/accept`
      : `/me/coach/bookings/${encodeURIComponent(id)}/refuse`;
  const payload = await apiFetch<unknown>(path, { method: "POST" });
  return bookingToRequest(mapBooking(unwrapOne(payload)));
}

export async function completeCoachBooking(id: string): Promise<unknown> {
  return apiFetch<unknown>(
    `/me/coach/bookings/${encodeURIComponent(id)}/complete`,
    { method: "POST" },
  );
}

export type CoachProfilePatch = {
  bio?: string;
  experienceYears?: number;
  certifications?: string[];
  levelsTaught?: string[];
  pricePerHour?: number;
  city?: string;
};

export async function patchCoachProfile(
  body: CoachProfilePatch,
): Promise<unknown> {
  return apiFetch<unknown>("/me/coach/profile", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function putCoachAvailabilities(
  availabilities: CoachAvailabilityWindow[],
): Promise<unknown> {
  return apiFetch<unknown>("/me/coach/availabilities", {
    method: "PUT",
    body: JSON.stringify({ availabilities }),
  });
}

export async function createCoachAssessment(input: {
  playerId: string;
  level: LevelCode;
  note?: string;
}): Promise<unknown> {
  return apiFetch<unknown>("/me/coach/assessments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function defaultWeekdayAvailabilities(): CoachAvailabilityWindow[] {
  return ["MON", "TUE", "WED", "THU", "FRI"].map((weekday) => ({
    weekday,
    fromMin: 18 * 60,
    toMin: 20 * 60,
  }));
}
