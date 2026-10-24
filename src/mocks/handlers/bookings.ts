import { http, HttpResponse } from "msw";

type MockBooking = {
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
  endAt: string;
  durationMin: number;
  price: number;
};

const bookings = new Map<string, MockBooking>();
const payments = new Map<
  string,
  { id: string; status: string; amount: number; bookingId: string }
>();

let seq = 1;

function addMinutesIso(startAt: string, minutes: number): string {
  const d = new Date(startAt);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export const bookingsHandlers = [
  http.post("*/api/v1/bookings", async ({ request }) => {
    const body = (await request.json()) as {
      courtId: string;
      startAt: string;
      durationMin: number;
      paymentMode: string;
    };
    const id = `bk-${seq++}`;
    const paymentMode = body.paymentMode?.toUpperCase() ?? "ON_SITE";
    let paymentId: string | null = null;
    let status = "CONFIRMED";

    if (paymentMode === "CARD") {
      paymentId = `pay-${seq++}`;
      status = "HELD";
      payments.set(paymentId, {
        id: paymentId,
        status: "PENDING",
        amount: 90,
        bookingId: id,
      });
    }

    const booking: MockBooking = {
      id,
      status,
      paymentId,
      courtId: body.courtId,
      courtName: "Court 1",
      clubId: "club-1",
      clubName: "Padel House Carthage",
      clubLocation: "Tunis",
      clubImage: null,
      startAt: body.startAt,
      endAt: addMinutesIso(body.startAt, body.durationMin ?? 90),
      durationMin: body.durationMin ?? 90,
      price: 90,
    };
    bookings.set(id, booking);
    return HttpResponse.json(booking, { status: 201 });
  }),

  http.get("*/api/v1/me/bookings", ({ request }) => {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope") ?? "upcoming";
    const now = Date.now();
    const list = [...bookings.values()].filter((b) => {
      const start = new Date(b.startAt).getTime();
      return scope === "past" ? start < now : start >= now;
    });
    return HttpResponse.json({ items: list });
  }),

  http.get("*/api/v1/bookings/:id", ({ params }) => {
    const booking = bookings.get(String(params.id));
    if (!booking) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Booking not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(booking);
  }),

  http.post("*/api/v1/bookings/:id/cancel", async ({ params, request }) => {
    const booking = bookings.get(String(params.id));
    if (!booking) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Booking not found" },
        { status: 404 },
      );
    }
    await request.json().catch(() => ({}));
    booking.status = "CANCELLED";
    bookings.set(booking.id, booking);
    return HttpResponse.json({ ...booking, refundPercent: 100 });
  }),

  http.get("*/api/v1/me/payments", () => {
    return HttpResponse.json({ items: [...payments.values()] });
  }),

  http.post("*/api/v1/payments/:id/mock/confirm", ({ params }) => {
    const payment = payments.get(String(params.id));
    if (!payment) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Payment not found" },
        { status: 404 },
      );
    }
    payment.status = "SUCCESS";
    payments.set(payment.id, payment);
    const booking = bookings.get(payment.bookingId);
    if (booking) {
      booking.status = "CONFIRMED";
      bookings.set(booking.id, booking);
    }
    return HttpResponse.json(payment);
  }),

  http.post("*/api/v1/payments/:id/mock/fail", ({ params }) => {
    const payment = payments.get(String(params.id));
    if (!payment) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Payment not found" },
        { status: 404 },
      );
    }
    payment.status = "FAILED";
    payments.set(payment.id, payment);
    const booking = bookings.get(payment.bookingId);
    if (booking) {
      booking.status = "CANCELLED";
      bookings.set(booking.id, booking);
    }
    return HttpResponse.json(payment);
  }),

  http.get("*/api/v1/payments/:id/receipt", ({ params }) => {
    const payment = payments.get(String(params.id));
    if (!payment) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Payment not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      number: `PAY-${payment.id.toUpperCase()}`,
      clubName: "Padel House Carthage",
      bookingNumber: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
      paidAt: new Date().toISOString(),
    });
  }),

  http.get("*/api/v1/me/wallet", () => {
    return HttpResponse.json({
      balance: 120,
      transactions: [
        {
          id: "tx-1",
          type: "PURCHASE",
          tokens: 50,
          amount: 50,
          createdAt: new Date().toISOString(),
          label: "Achat de jetons",
        },
      ],
    });
  }),

  http.post("*/api/v1/me/wallet/purchases", async ({ request }) => {
    const body = (await request.json()) as { tokens: number };
    const paymentId = `pay-tok-${seq++}`;
    payments.set(paymentId, {
      id: paymentId,
      status: "PENDING",
      amount: body.tokens,
      bookingId: "",
    });
    return HttpResponse.json({ paymentId, status: "PENDING" });
  }),
];
