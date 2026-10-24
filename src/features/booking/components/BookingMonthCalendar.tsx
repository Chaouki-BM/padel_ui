"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingMonthCalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

const WEEKDAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export function BookingMonthCalendar({
  selectedDate,
  onSelectDate,
}: BookingMonthCalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <button
          type="button"
          onClick={() => onSelectDate(subMonths(selectedDate, 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 sm:h-8 sm:w-8"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
        </button>
        <h3 className="text-sm font-black text-[#0B1A2D] capitalize">
          {format(selectedDate, "MMMM yyyy", { locale: fr })}
        </h3>
        <button
          type="button"
          onClick={() => onSelectDate(addMonths(selectedDate, 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 sm:h-8 sm:w-8"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5 sm:mb-2 sm:gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const selected = isSameDay(day, selectedDate);
          const inMonth = isSameMonth(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-9",
                !inMonth && "text-slate-300",
                inMonth && !selected && "text-slate-700 hover:bg-slate-100",
                selected && "bg-[#0B1A2D] text-white",
              )}
            >
              {format(day, "d")}
              {selected ? (
                <span className="absolute bottom-1.5 h-0.5 w-3 rounded-full bg-[#C0FF00] sm:bottom-1" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
