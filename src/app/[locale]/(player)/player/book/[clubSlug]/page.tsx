"use client";

import { use, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Filter, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BookingActionBar } from "@/features/booking/components/BookingActionBar";
import { BookingClubHero } from "@/features/booking/components/BookingClubHero";
import { BookingMonthCalendar } from "@/features/booking/components/BookingMonthCalendar";
import { SlotGrid } from "@/features/booking/components/SlotGrid";
import { useAvailability } from "@/hooks/useAvailability";
import { useCreateBooking } from "@/hooks/useBookings";
import { useClub } from "@/hooks/useClub";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { buildStartAt, durationFromSlot } from "@/lib/booking-time";
import { COURT_TYPES } from "@/lib/constants";
import { type PaymentMode } from "@/services/bookings";
import { type AvailabilitySlot } from "@/types";

type PageProps = {
  params: Promise<{ clubSlug: string }>;
};

export default function BookAvailabilityPage({ params }: PageProps) {
  const { clubSlug } = use(params);
  const t = useTranslations("bookingCalendar");
  const router = useRouter();
  const createBooking = useCreateBooking();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [courtType, setCourtType] = useState<string>(COURT_TYPES[0]);
  const [activeCourtId, setActiveCourtId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("ON_SITE");
  const [durationMin, setDurationMin] = useState(90);

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const { data: club, isLoading: clubLoading } = useClub(clubSlug);
  const {
    data: availability,
    isLoading: availabilityLoading,
    isError,
    refetch,
  } = useAvailability(clubSlug, dateKey, courtType, durationMin);

  const courts = availability?.courts ?? [];
  const resolvedCourtId = activeCourtId ?? courts[0]?.id ?? "";
  const dateLabel = useMemo(
    () => format(selectedDate, "EEEE d MMMM", { locale: fr }),
    [selectedDate],
  );

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  async function handleReserve() {
    if (!selectedSlot || !club || !resolvedCourtId) return;
    const slotDuration = durationFromSlot(
      selectedSlot.startTime,
      selectedSlot.endTime,
      durationMin,
    );
    try {
      const booking = await createBooking.mutateAsync({
        courtId: resolvedCourtId,
        startAt: buildStartAt(dateKey, selectedSlot.startTime),
        durationMin: slotDuration,
        paymentMode,
      });

      if (
        paymentMode === "CARD" &&
        booking.paymentId &&
        (booking.status === "HELD" || booking.status.includes("HOLD"))
      ) {
        router.push(
          `/player/pay/${booking.paymentId}?bookingId=${encodeURIComponent(booking.id)}`,
        );
        return;
      }

      toast.success(t("reserveSuccess"), {
        description: t("reserveSuccessDesc", {
          club: club.name,
          start: selectedSlot.startTime,
          date: format(selectedDate, "dd/MM/yyyy"),
        }),
      });
      router.push("/player/bookings");
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("error")));
    }
  }

  if (clubLoading) {
    return (
      <div className="mx-auto max-w-[1200px] animate-pulse space-y-4 px-3 py-6 sm:px-4 sm:py-8">
        <div className="h-8 w-48 rounded bg-slate-200 sm:w-72" />
        <div className="h-36 rounded-2xl bg-slate-100 sm:h-40" />
        <div className="h-64 rounded-2xl bg-slate-100 sm:h-96" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-medium text-slate-500">{t("clubError")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 py-4 pb-36 sm:gap-6 sm:px-6 sm:py-8 md:pb-10 lg:px-8">
      <header className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl leading-tight font-black tracking-tight text-[#0B1A2D] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-slate-200 text-xs font-semibold sm:h-10 sm:text-sm"
          >
            <Filter className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("advancedFilters")}</span>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-[#0B1A2D] text-xs font-semibold text-white hover:bg-[#0B1A2D]/90 sm:h-10 sm:text-sm"
          >
            <Link href="/player/open-matches">
              <Swords className="h-4 w-4 shrink-0" />
              <span className="truncate">{t("openMatch")}</span>
            </Link>
          </Button>
        </div>
      </header>

      <BookingClubHero club={club} />

      {/* Mobile: calendar → type → slots → info cards. Desktop: sidebar | slots */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
        <aside className="flex flex-col gap-3 sm:gap-4 lg:col-span-4">
          <BookingMonthCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {t("courtType")}
            </label>
            <select
              value={courtType}
              onChange={(e) => {
                setCourtType(e.target.value);
                setSelectedSlot(null);
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-[#0B1A2D] outline-none focus:ring-2 focus:ring-[#0B1A2D]/20"
            >
              {COURT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label className="mt-4 mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {t("duration")}
            </label>
            <select
              value={durationMin}
              onChange={(e) => {
                setDurationMin(Number(e.target.value));
                setSelectedSlot(null);
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-[#0B1A2D] outline-none focus:ring-2 focus:ring-[#0B1A2D]/20"
            >
              {[60, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>

            <label className="mt-4 mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {t("paymentMode")}
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-[#0B1A2D] outline-none focus:ring-2 focus:ring-[#0B1A2D]/20"
            >
              <option value="ON_SITE">{t("payOnSite")}</option>
              <option value="CARD">{t("payCard")}</option>
              <option value="TOKENS">{t("payTokens")}</option>
            </select>
          </div>

          {/* Info cards: after slots on mobile, stay in sidebar on desktop */}
          <div className="hidden flex-col gap-4 lg:flex">
            <SpecialOfferCard title={t("specialOfferTitle")} desc={t("specialOfferDesc")} />
            <CancelPolicyCard title={t("cancelPolicyTitle")} desc={t("cancelPolicyDesc")} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8">
          {availabilityLoading ? (
            <div className="h-72 animate-pulse rounded-2xl bg-slate-100 sm:h-[520px]" />
          ) : null}

          {isError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white py-12 sm:py-16">
              <p className="text-sm font-medium text-slate-500">{t("error")}</p>
              <Button
                onClick={() => void refetch()}
                className="rounded-full bg-[#0B1A2D] font-semibold text-white"
              >
                {t("retry")}
              </Button>
            </div>
          ) : null}

          {!availabilityLoading && !isError && courts.length > 0 ? (
            <>
              <SlotGrid
                courts={courts}
                activeCourtId={resolvedCourtId}
                onCourtChange={(id) => {
                  setActiveCourtId(id);
                  setSelectedSlot(null);
                }}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelectSlot={(slot, courtId) => {
                  setActiveCourtId(courtId);
                  setSelectedSlot(slot);
                }}
                dateLabel={dateLabel}
              />
              <BookingActionBar
                selectedSlot={selectedSlot}
                onReserve={() => void handleReserve()}
                isReserving={createBooking.isPending}
              />
            </>
          ) : null}
        </div>

        {/* Mobile-only: secondary info below slots */}
        <div className="flex flex-col gap-3 lg:hidden">
          <SpecialOfferCard title={t("specialOfferTitle")} desc={t("specialOfferDesc")} />
          <CancelPolicyCard title={t("cancelPolicyTitle")} desc={t("cancelPolicyDesc")} />
        </div>
      </div>
    </div>
  );
}

function SpecialOfferCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[#C0FF00]/40 bg-[#F3FFCC] p-3 sm:p-5">
      <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
        <Sparkles className="h-4 w-4 text-[#0B1A2D]" />
        <h3 className="text-sm font-black text-[#0B1A2D]">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed font-medium text-[#0B1A2D]/80">
        {desc}
      </p>
    </div>
  );
}

function CancelPolicyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-[#0B1A2D] p-3 text-white sm:p-5">
      <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
        <ShieldCheck className="h-4 w-4 text-[#C0FF00]" />
        <h3 className="text-sm font-black">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed font-medium text-white/75">{desc}</p>
    </div>
  );
}
