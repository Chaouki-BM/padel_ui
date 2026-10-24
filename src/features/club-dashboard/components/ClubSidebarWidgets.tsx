"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CloudSun } from "lucide-react";
import { BookingMonthCalendar } from "@/features/booking/components/BookingMonthCalendar";
import { type ClubAgendaItem, type ClubWeather } from "@/types";
import { cn } from "@/lib/utils";

type ClubSidebarWidgetsProps = {
  agenda: ClubAgendaItem[];
  weather: ClubWeather;
};

export function ClubSidebarWidgets({
  agenda,
  weather,
}: ClubSidebarWidgetsProps) {
  const t = useTranslations("clubDashboard");
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  return (
    <aside className="flex flex-col gap-4">
      <BookingMonthCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-black text-[#0B1A2D]">
          {t("agendaTitle")}
        </h3>
        <ul className="space-y-3">
          {agenda.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-xl border p-3",
                item.live
                  ? "border-[#C0FF00]/50 bg-[#F3FFCC]"
                  : "border-slate-100 bg-slate-50",
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#0B1A2D]">{item.title}</p>
                {item.live ? (
                  <span className="rounded-full bg-[#0B1A2D] px-2 py-0.5 text-[9px] font-bold text-[#C0FF00] uppercase">
                    {t("live")}
                  </span>
                ) : null}
              </div>
              <p className="text-xs font-medium text-slate-500">
                {item.timeRange} · {item.meta}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-[#0B1A2D] p-5 text-white">
        <CloudSun className="absolute -right-2 -bottom-2 h-24 w-24 text-white/10" />
        <p className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
          {t("weatherTitle", { city: weather.city })}
        </p>
        <p className="mt-2 text-3xl font-black">{weather.temperatureC}°C</p>
        {weather.ideal ? (
          <span className="mt-3 inline-block rounded-full bg-[#C0FF00] px-3 py-1 text-[10px] font-black text-[#0B1A2D] uppercase">
            {weather.label}
          </span>
        ) : (
          <p className="mt-2 text-sm font-medium text-white/80">{weather.label}</p>
        )}
      </div>
    </aside>
  );
}
