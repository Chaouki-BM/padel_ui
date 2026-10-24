import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { formatTunisDate } from "@/lib/format";
import { apiFetch } from "@/services/api";

export type PaymentMode = "CARD" | "ON_SITE" | "TOKENS";

export type CreateBookingBody = {
  courtId: string;
  startAt: string;
  durationMin: number;
  playersCount?: number;
  paymentMode: PaymentMode;
  promoCode?: string;
};

export type BookingSummary = {
  id: string;
  status: string;
  paymentId: string | null;
  courtId: string;
  courtName: string;
  clubId: string;
  clubName: string;
  clubLocation: string;
  clubImage: string | null;
  startAt: string;
  endAt: string | null;
  durationMin: number;
  price: number;
  dateLabel: string;
  timeLabel: string;
  refundPercent: number | null;
};

function mapBooking(rawUnknown: unknown): BookingSummary {
  const raw = asRecord(rawUnknown);
  const court = asRecord(raw.court);
  const club = asRecord(raw.club ?? court.club);
  const startAt = asString(raw.startAt);
  const endAt =
    raw.endAt === null || raw.endAt === undefined
      ? null
      : asString(raw.endAt);
  let dateLabel = "";
  let timeLabel = "";
  if (startAt) {
    try {
      dateLabel = formatTunisDate(startAt).split(",")[0] ?? formatTunisDate(startAt);
      const d = new Date(startAt);
      timeLabel = d.toLocaleTimeString("fr-TN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Tunis",
      });
      if (endAt) {
        const e = new Date(endAt);
        timeLabel += ` - ${e.toLocaleTimeString("fr-TN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Tunis",
        })}`;
      }
    } catch {
      dateLabel = startAt;
    }
  }

  return {
    id: asString(raw.id),
    status: asString(raw.status, "UNKNOWN").toUpperCase(),
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
    courtId: asString(raw.courtId, asString(court.id)),
    courtName: asString(court.name, asString(raw.courtName, "Court")),
    clubId: asString(raw.clubId, asString(club.id)),
    clubName: asString(raw.clubName, asString(club.name, "Club")),
    clubLocation: asString(
      raw.clubLocation,
      asString(club.city, asString(club.address)),
    ),
    clubImage:
      asString(club.imageUrl) ||
      asString(club.logoUrl) ||
      asString(raw.clubImage) ||
      null,
    startAt,
    endAt,
    durationMin: asNumber(raw.durationMin, 90),
    price: asNumber(
      raw.price,
      asNumber(raw.totalAmount, asNumber(raw.amount, 0)),
    ),
    dateLabel,
    timeLabel,
    refundPercent:
      raw.refundPercent === null || raw.refundPercent === undefined
        ? null
        : asNumber(raw.refundPercent),
  };
}

export async function createBooking(
  body: CreateBookingBody,
): Promise<BookingSummary> {
  const payload = await apiFetch<unknown>("/bookings", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapBooking(unwrapOne(payload));
}

export async function getMyBookings(
  scope: "upcoming" | "past" = "upcoming",
): Promise<BookingSummary[]> {
  const payload = await apiFetch<unknown>(`/me/bookings?scope=${scope}`);
  return unwrapList(payload).map(mapBooking);
}

export async function getBooking(id: string): Promise<BookingSummary> {
  const payload = await apiFetch<unknown>(`/bookings/${encodeURIComponent(id)}`);
  return mapBooking(unwrapOne(payload));
}

export async function cancelBooking(
  id: string,
  reason?: string,
): Promise<BookingSummary> {
  const payload = await apiFetch<unknown>(
    `/bookings/${encodeURIComponent(id)}/cancel`,
    {
      method: "POST",
      body: JSON.stringify(reason ? { reason } : {}),
    },
  );
  return mapBooking(unwrapOne(payload));
}
