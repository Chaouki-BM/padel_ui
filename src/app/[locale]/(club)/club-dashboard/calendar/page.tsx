"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { BookingMonthCalendar } from "@/features/booking/components/BookingMonthCalendar";
import { ClubReservationsTable } from "@/features/club-dashboard/components/ClubReservationsTable";
import { useClubBookings } from "@/hooks/useClubDashboard";
import { Button } from "@/components/ui/button";

export default function ClubCalendarPage() {
  const t = useTranslations("clubCalendarPage");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dayKey = format(selectedDate, "yyyy-MM-dd");
  const { data, isLoading, isError, refetch } = useClubBookings({
    from: dayKey,
    to: dayKey,
  });
  const dateLabel = format(selectedDate, "EEEE d MMMM", { locale: fr });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[900px] animate-pulse space-y-4 px-4 py-8">
        <div className="h-64 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  const bookings = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <BookingMonthCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-base font-black capitalize text-[#0B1A2D]">
            {dateLabel}
          </h2>
          <p className="mb-4 text-xs font-medium text-slate-500">{t("agendaHint")}</p>
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">{t("emptyDay")}</p>
          ) : (
            <ul className="space-y-3">
              {bookings.map((res) => (
                <li
                  key={res.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-sm font-bold text-[#0B1A2D]">
                    {res.playerName} · {res.courtName}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {res.timeRange} · {res.price} TND · {res.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ClubReservationsTable reservations={bookings} />
    </div>
  );
}
