"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  Clock4,
  Info,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCancelBooking, useMyBookings } from "@/hooks/useBookings";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { type BookingSummary } from "@/services/bookings";

export default function BookingsPage() {
  const t = useTranslations("bookingsPage");
  const tCommon = useTranslations("common");
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scope = activeTab === "upcoming" ? "upcoming" : "past";
  const { data, isLoading, isError, refetch } = useMyBookings(scope);
  const cancelMutation = useCancelBooking();
  const bookings = data ?? [];

  async function handleCancel(booking: BookingSummary) {
    try {
      const result = await cancelMutation.mutateAsync({ id: booking.id });
      toast.success(
        result.refundPercent != null
          ? t("cancelSuccessRefund", { percent: result.refundPercent })
          : t("cancelSuccess"),
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  function statusKey(status: string): string {
    const s = status.toLowerCase();
    if (s.includes("confirm") || s === "confirmed") return "confirmed";
    if (s.includes("cancel")) return "cancelled";
    if (s.includes("hold") || s === "held") return "held";
    return "confirmed";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0B2341] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{t("subtitle")}</p>
        </div>

        <div className="flex self-start rounded-full bg-gray-100 p-1 md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`rounded-full px-6 py-2 text-xs font-bold transition-all sm:text-sm ${
              activeTab === "upcoming"
                ? "bg-[#0B2341] text-white shadow-xs"
                : "text-gray-500"
            }`}
          >
            {t("tabs.upcoming", { count: activeTab === "upcoming" ? bookings.length : "…" })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`rounded-full px-6 py-2 text-xs font-semibold transition-all sm:text-sm ${
              activeTab === "history"
                ? "bg-[#0B2341] text-white shadow-xs"
                : "text-gray-500"
            }`}
          >
            {t("tabs.history")}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-8">
          {isLoading ? (
            <p className="text-sm text-slate-500">{tCommon("loading")}</p>
          ) : null}
          {isError ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-red-600">{tCommon("error")}</p>
              <Button type="button" variant="outline" onClick={() => void refetch()}>
                {tCommon("errorRetry")}
              </Button>
            </div>
          ) : null}
          {!isLoading && !isError && bookings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              {t("empty")}
            </p>
          ) : null}

          {bookings.map((booking) => {
            const sk = statusKey(booking.status);
            const canCancel =
              activeTab === "upcoming" &&
              !booking.status.includes("CANCEL");
            return (
              <div
                key={booking.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs md:flex-row"
              >
                <div className="relative h-48 w-full shrink-0 bg-slate-100 md:h-auto md:w-64">
                  {booking.clubImage ? (
                    <Image
                      src={booking.clubImage}
                      alt={booking.clubName}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  <Badge className="absolute top-3.5 left-3.5 rounded-full border-none bg-[#0B2341] px-3 py-1 text-[11px] font-bold text-[#E2F832]">
                    {t(`card.status.${sk}`)}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-[#0B2341] sm:text-lg">
                        {booking.clubName}
                      </h2>
                      <div className="mt-1 flex items-center text-xs text-gray-400">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        {booking.clubLocation || "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-[#0B2341] sm:text-lg">
                        {booking.price}{" "}
                        <span className="text-xs font-bold">
                          {t("card.currency")}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-400">
                        {t("card.id")} {booking.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>

                  <div className="my-4 grid grid-cols-3 gap-2 border-y border-gray-100 py-3.5 sm:gap-4">
                    <div>
                      <div className="flex items-center text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#A1E533]" />
                        {t("card.date")}
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0B2341] sm:text-sm">
                        {booking.dateLabel || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <Clock className="mr-1.5 h-3.5 w-3.5 text-[#A1E533]" />
                        {t("card.time")}
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0B2341] sm:text-sm">
                        {booking.timeLabel || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <Info className="mr-1.5 h-3.5 w-3.5 text-[#A1E533]" />
                        {t("card.court")}
                      </div>
                      <div className="mt-1 truncate text-xs font-bold text-[#0B2341] sm:text-sm">
                        {booking.courtName}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {booking.paymentId && sk === "held" ? (
                      <Button asChild className="rounded-full bg-[#0B1A2D] text-white">
                        <Link
                          href={`/player/pay/${booking.paymentId}?bookingId=${booking.id}`}
                        >
                          {t("card.payNow")}
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs font-medium text-gray-600">
                        <ShieldCheck className="mr-1.5 h-4 w-4 shrink-0" />
                        <span>{t("card.refund.full")}</span>
                      </div>
                    )}
                    {canCancel ? (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={cancelMutation.isPending}
                        onClick={() => void handleCancel(booking)}
                        className="h-10 w-full rounded-full border border-red-200 px-5 text-xs font-semibold text-red-500 sm:h-8 sm:w-auto"
                      >
                        {t("card.cancelAction")}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-2xl border border-gray-100 border-l-4 border-l-[#C8F322] bg-[#F8F9FA] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
                <ShieldCheck className="h-5 w-5 text-[#86C400]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B2341]">
                  {t("refundPolicy.title")}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {t("refundPolicy.subtitle")}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-gray-100 bg-white p-3.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-extrabold uppercase">
                    {t("refundPolicy.freeCancellation.title")}
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-gray-400">
                  {t("refundPolicy.freeCancellation.desc")}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-3.5">
                <div className="flex items-center gap-1.5">
                  <Clock4 className="h-3.5 w-3.5 text-[#A1E533]" />
                  <span className="text-[10px] font-extrabold uppercase">
                    {t("refundPolicy.lateCancellation.title")}
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-gray-400">
                  {t("refundPolicy.lateCancellation.desc")}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-3.5">
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-[10px] font-extrabold uppercase">
                    {t("refundPolicy.noRefund.title")}
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-gray-400">
                  {t("refundPolicy.noRefund.desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold text-[#0B2341]">{t("faq.title")}</h3>
            </div>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                className="flex w-full items-center justify-between border-t border-slate-50 py-3 text-left text-xs font-semibold text-slate-700"
              >
                {t(`faq.q${index + 1}`)}
                <ChevronDown
                  className={`h-4 w-4 transition ${openFaq === index ? "rotate-180" : ""}`}
                />
              </button>
            ))}
            {openFaq !== null ? (
              <p className="pb-2 text-xs text-slate-500">
                {t(`faq.a${openFaq + 1}`)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
