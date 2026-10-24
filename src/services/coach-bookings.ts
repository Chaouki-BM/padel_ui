import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { formatTunisDate } from "@/lib/format";
import { apiFetch } from "@/services/api";

export type CoachBooking = {
  id: string;
  status: string;
  coachId: string;
  coachName: string;
  startAt: string;
  durationMin: number;
  price: number;
  dateLabel: string;
  paymentId: string | null;
};

export type CreateCoachBookingBody = {
  startAt: string;
  durationMin: 60 | 90 | 120;
  note?: string;
};

function mapCoachBooking(rawUnknown: unknown): CoachBooking {
  const raw = asRecord(rawUnknown);
  const coach = asRecord(raw.coach);
  const startAt = asString(raw.startAt);
  return {
    id: asString(raw.id),
    status: asString(raw.status, "REQUESTED").toUpperCase(),
    coachId: asString(raw.coachId, asString(coach.id)),
    coachName: asString(
      raw.coachName,
      asString(coach.displayName, asString(coach.name, "Coach")),
    ),
    startAt,
    durationMin: asNumber(raw.durationMin, 60) as 60 | 90 | 120,
    price: asNumber(raw.price, asNumber(raw.amount, 0)),
    dateLabel: startAt ? formatTunisDate(startAt) : "—",
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
  };
}

export async function bookCoach(
  coachId: string,
  body: CreateCoachBookingBody,
): Promise<CoachBooking> {
  const payload = await apiFetch<unknown>(
    `/coaches/${encodeURIComponent(coachId)}/bookings`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  return mapCoachBooking(unwrapOne(payload));
}

export async function getMyCoachBookings(): Promise<CoachBooking[]> {
  const payload = await apiFetch<unknown>("/me/coach-bookings");
  return unwrapList(payload).map(mapCoachBooking);
}

export async function cancelCoachBooking(id: string): Promise<CoachBooking> {
  const payload = await apiFetch<unknown>(
    `/me/coach-bookings/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
  );
  return mapCoachBooking(unwrapOne(payload));
}
