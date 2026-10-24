"use client";

import { use, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BookingActionBar } from "@/features/booking/components/BookingActionBar";
import { BookingMonthCalendar } from "@/features/booking/components/BookingMonthCalendar";
import { BookingCoachHero } from "@/features/coaches/components/BookingCoachHero";
import { CoachSlotGrid } from "@/features/coaches/components/CoachSlotGrid";
import { useBookCoach } from "@/hooks/useCoachBookings";
import { useCoach, useCoachAvailability } from "@/hooks/useCoaches";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { buildStartAt } from "@/lib/booking-time";
import { type AvailabilitySlot } from "@/types";

const SESSION_DURATIONS = [60, 90] as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function CoachBookPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("coachBookingCalendar");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const bookCoach = useBookCoach();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [sessionMinutes, setSessionMinutes] =
    useState<(typeof SESSION_DURATIONS)[number]>(60);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const { data: coach, isLoading: coachLoading } = useCoach(slug);
  const {
    data: availability,
    isLoading: availabilityLoading,
    isError,
    refetch,
  } = useCoachAvailability(slug, dateKey, sessionMinutes);

  const dateLabel = useMemo(
    () => format(selectedDate, "EEEE d MMMM", { locale: fr }),
    [selectedDate],
  );

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  async function handleReserve() {
    if (!selectedSlot || !coach) return;
    try {
      const booking = await bookCoach.mutateAsync({
        coachId: coach.id,
        body: {
          startAt: buildStartAt(dateKey, selectedSlot.startTime),
          durationMin: sessionMinutes,
        },
      });
      toast.success(t("reserveSuccess"), {
        description: t("reserveSuccessDesc", {
          coach: coach.displayName,
          start: selectedSlot.startTime,
          date: format(selectedDate, "dd/MM/yyyy"),
        }),
      });
      if (booking.paymentId) {
        router.push(`/player/pay/${booking.paymentId}`);
        return;
      }
      router.push("/player/profile");
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  if (coachLoading) {
    return (
      <div className="mx-auto max-w-[1200px] animate-pulse space-y-4 px-3 py-6 sm:px-4 sm:py-8">
        <div className="h-8 w-48 rounded bg-slate-200 sm:w-72" />
        <div className="h-36 rounded-2xl bg-slate-100 sm:h-40" />
        <div className="h-64 rounded-2xl bg-slate-100 sm:h-96" />
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-medium text-slate-500">{t("coachError")}</p>
      </div>
    );
  }

  const slots = availability?.slots ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 py-4 pb-36 sm:gap-6 sm:px-6 sm:py-8 md:pb-10 lg:px-8">
      <header className="min-w-0">
        <h1 className="text-xl leading-tight font-black tracking-tight text-[#0B1A2D] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
          {t("subtitle")}
        </p>
      </header>

      <BookingCoachHero coach={coach} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
        <aside className="flex flex-col gap-3 sm:gap-4 lg:col-span-4">
          <BookingMonthCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {t("sessionDuration")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SESSION_DURATIONS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => {
                    setSessionMinutes(minutes);
                    setSelectedSlot(null);
                  }}
                  className={
                    sessionMinutes === minutes
                      ? "h-11 rounded-xl bg-[#0B1A2D] text-sm font-bold text-[#C0FF00]"
                      : "h-11 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 hover:border-[#0B1A2D]/30"
                  }
                >
                  {t("sessionMinutes", { minutes })}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden flex-col gap-4 lg:flex">
            <SpecialOfferCard
              title={t("specialOfferTitle")}
              desc={t("specialOfferDesc")}
            />
            <CancelPolicyCard
              title={t("cancelPolicyTitle")}
              desc={t("cancelPolicyDesc")}
            />
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

          {!availabilityLoading && !isError && slots.length > 0 ? (
            <>
              <CoachSlotGrid
                slots={slots}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelectSlot={setSelectedSlot}
                dateLabel={dateLabel}
              />
              <BookingActionBar
                selectedSlot={selectedSlot}
                onReserve={() => void handleReserve()}
                isReserving={bookCoach.isPending}
              />
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <SpecialOfferCard
            title={t("specialOfferTitle")}
            desc={t("specialOfferDesc")}
          />
          <CancelPolicyCard
            title={t("cancelPolicyTitle")}
            desc={t("cancelPolicyDesc")}
          />
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
