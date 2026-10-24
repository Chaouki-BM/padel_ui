"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookingMonthCalendar } from "@/features/booking/components/BookingMonthCalendar";
import {
  useCoachAvailabilities,
  useCoachSpaceAvailability,
  usePutCoachAvailabilities,
} from "@/hooks/useCoachSpace";
import { minutesToHm } from "@/lib/time";
import { cn } from "@/lib/utils";

export default function CoachAvailabilityPage() {
  const t = useTranslations("coachSpaceAvailability");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const { data, isLoading, isError, refetch } =
    useCoachSpaceAvailability(dateKey);
  const weeks = useCoachAvailabilities();
  const putAvail = usePutCoachAvailabilities();

  const dateLabel = format(selectedDate, "EEEE d MMMM", { locale: fr });

  async function onSaveWeek() {
    try {
      await putAvail.mutateAsync(undefined);
      toast.success(t("weekSaved"));
    } catch {
      toast.error(t("weekError"));
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
        </div>
        <Button
          type="button"
          disabled={putAvail.isPending}
          onClick={() => void onSaveWeek()}
          className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("saveWeek")}
        </Button>
      </header>

      {(weeks.data?.length ?? 0) > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {weeks.data!.map((w) => (
            <li
              key={`${w.weekday}-${w.fromMin}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#0B1A2D]"
            >
              {String(w.weekday)} · {minutesToHm(w.fromMin)}–{minutesToHm(w.toMin)}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <BookingMonthCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-1 text-base font-black capitalize text-[#0B1A2D]">
              {dateLabel}
            </h2>
            <p className="mb-4 text-xs font-medium text-slate-500">
              {t("hint")}
            </p>

            {isLoading ? (
              <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
            ) : null}

            {isError ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-sm text-slate-500">{t("error")}</p>
                <Button
                  onClick={() => void refetch()}
                  className="rounded-full bg-[#0B1A2D] text-white"
                >
                  {t("retry")}
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && data ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {data.slots.map((slot) => (
                  <div
                    key={slot.time}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-left",
                      slot.status === "free"
                        ? "border-[#C0FF00]/50 bg-[#F3FFCC] text-[#0B1A2D]"
                        : "border-slate-100 bg-slate-50 text-slate-400",
                    )}
                  >
                    <div className="text-sm font-bold">{slot.time}</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase">
                      {t(`status.${slot.status}`)}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
