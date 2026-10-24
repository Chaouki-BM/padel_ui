import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";

export type PaymentSummary = {
  id: string;
  status: string;
  amount: number;
  refundedAmount: number;
  bookingId: string | null;
  createdAt: string;
};

export type PaymentReceipt = {
  number: string;
  clubName: string;
  bookingNumber: string;
  amount: number;
  status: string;
  paidAt: string | null;
  raw: Record<string, unknown>;
};

function mapPayment(rawUnknown: unknown): PaymentSummary {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id),
    status: asString(raw.status, "PENDING").toUpperCase(),
    amount: asNumber(raw.amount, asNumber(raw.total, 0)),
    refundedAmount: asNumber(raw.refundedAmount, asNumber(raw.refundedTotal, 0)),
    bookingId:
      raw.bookingId === null || raw.bookingId === undefined
        ? null
        : asString(raw.bookingId),
    createdAt: asString(raw.createdAt),
  };
}

export async function getMyPayments(): Promise<PaymentSummary[]> {
  const payload = await apiFetch<unknown>("/me/payments");
  return unwrapList(payload).map(mapPayment);
}

export async function mockConfirmPayment(paymentId: string): Promise<void> {
  await apiFetch<unknown>(
    `/payments/${encodeURIComponent(paymentId)}/mock/confirm`,
    { method: "POST" },
  );
}

export async function mockFailPayment(paymentId: string): Promise<void> {
  await apiFetch<unknown>(
    `/payments/${encodeURIComponent(paymentId)}/mock/fail`,
    { method: "POST" },
  );
}

export async function getPaymentReceipt(
  paymentId: string,
): Promise<PaymentReceipt> {
  const payload = await apiFetch<unknown>(
    `/payments/${encodeURIComponent(paymentId)}/receipt`,
  );
  const raw = asRecord(unwrapOne(payload));
  const club = asRecord(raw.club);
  return {
    number: asString(raw.number, asString(raw.receiptNumber, `PAY-${paymentId.slice(0, 8)}`)),
    clubName: asString(raw.clubName, asString(club.name, "Club")),
    bookingNumber: asString(
      raw.bookingNumber,
      asString(raw.bookingId, "—"),
    ),
    amount: asNumber(raw.amount, 0),
    status: asString(raw.status, "PAID"),
    paidAt:
      raw.paidAt === null || raw.paidAt === undefined
        ? null
        : asString(raw.paidAt),
    raw,
  };
}
