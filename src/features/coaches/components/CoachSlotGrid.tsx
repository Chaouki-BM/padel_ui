"use client";

import { useTranslations } from "next-intl";
import { type AvailabilitySlot } from "@/types";
import { type SlotPeriod } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CoachSlotGridProps = {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  dateLabel: string;
};

const PERIODS: { id: SlotPeriod; range: string }[] = [
  { id: "morning", range: "08:00 - 12:00" },
  { id: "afternoon", range: "14:00 - 18:00" },
  { id: "evening", range: "18:00 - 22:00" },
];

function slotClass(status: AvailabilitySlot["status"], selected: boolean) {
  if (selected) {
    return "border-[#C0FF00] bg-[#F3FFCC] text-[#0B1A2D] shadow-sm";
  }
  switch (status) {
    case "available":
      return "border-slate-100 bg-slate-50 text-slate-800 hover:border-[#C0FF00]/60 hover:bg-[#F8FFE6]";
    case "occupied":
      return "cursor-not-allowed border-rose-100 bg-rose-50 text-rose-400 opacity-80";
    case "reserved":
      return "cursor-not-allowed border-sky-100 bg-sky-50 text-sky-500 opacity-80";
    case "maintenance":
      return "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 opacity-70";
  }
}

export function CoachSlotGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
  dateLabel,
}: CoachSlotGridProps) {
  const t = useTranslations("coachBookingCalendar");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:gap-5 sm:p-5">
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase sm:text-xs">
          {dateLabel}
        </p>
        <h3 className="text-base font-black text-[#0B1A2D] sm:text-lg">
          {t("slotsTitle")}
        </h3>
      </div>

      {PERIODS.map((period) => {
        const periodSlots = slots.filter((slot) => slot.period === period.id);
        if (periodSlots.length === 0) return null;
        return (
          <section key={period.id}>
            <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
              <h4 className="text-[11px] font-black tracking-widest text-slate-500 uppercase sm:text-xs">
                {t(`periods.${period.id}`)}
              </h4>
              <span className="shrink-0 text-[10px] font-medium text-slate-400 sm:text-[11px]">
                {period.range}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {periodSlots.map((slot) => {
                const selected = selectedSlotId === slot.id;
                const disabled = slot.status !== "available";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectSlot(slot)}
                    className={cn(
                      "relative min-h-[3.5rem] rounded-xl border px-2.5 py-2.5 text-left transition-all touch-manipulation sm:px-3 sm:py-3",
                      slotClass(slot.status, selected),
                    )}
                  >
                    <div className="text-sm font-bold">
                      {slot.startTime}
                      {selected || slot.status === "available" ? (
                        <span className="mt-1 block text-xs font-semibold opacity-80">
                          {slot.price} {t("currency")}
                        </span>
                      ) : (
                        <span className="mt-1 block text-[10px] font-semibold uppercase">
                          {t(`status.${slot.status}`)}
                        </span>
                      )}
                    </div>
                    {slot.discountPercent && !disabled ? (
                      <span className="absolute -top-2 -right-1 rounded-full bg-[#C0FF00] px-1.5 py-0.5 text-[9px] font-black text-[#0B1A2D]">
                        -{slot.discountPercent}%
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500 sm:pt-4 sm:text-[11px]">
        {(
          ["available", "occupied", "reserved", "maintenance"] as const
        ).map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                status === "available" && "bg-[#22c55e]",
                status === "occupied" && "bg-rose-400",
                status === "reserved" && "bg-sky-400",
                status === "maintenance" && "bg-slate-400",
              )}
            />
            {t(`legend.${status}`)}
          </span>
        ))}
      </div>
    </div>
  );
}
