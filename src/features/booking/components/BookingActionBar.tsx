"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { type AvailabilitySlot } from "@/types";

type BookingActionBarProps = {
  selectedSlot: AvailabilitySlot | null;
  onReserve: () => void;
  isReserving?: boolean;
};

export function BookingActionBar({
  selectedSlot,
  onReserve,
  isReserving = false,
}: BookingActionBarProps) {
  const t = useTranslations("bookingCalendar");

  const total =
    selectedSlot == null
      ? null
      : selectedSlot.discountPercent
        ? Math.round(
            selectedSlot.price * (1 - selectedSlot.discountPercent / 100),
          )
        : selectedSlot.price;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] z-30 px-3 md:pointer-events-auto md:sticky md:bottom-4 md:z-20 md:mt-4 md:px-0">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1200px] flex-col gap-2 rounded-2xl bg-[#0B1A2D] p-3 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4 sm:px-6">
        <div className="min-w-0 text-center sm:text-left">
          <p className="truncate text-xs font-semibold text-white/80 sm:text-sm">
            {selectedSlot
              ? t("selectedSlot", {
                  start: selectedSlot.startTime,
                  end: selectedSlot.endTime,
                })
              : t("selectPrompt")}
          </p>
          <p className="mt-0.5 text-[10px] font-bold tracking-wider text-white/50 uppercase sm:text-xs">
            {t("estimatedTotal")}{" "}
            <span className="text-sm text-[#C0FF00] sm:text-base">
              {total == null ? "--" : total} {t("currency")}
            </span>
          </p>
        </div>
        <Button
          type="button"
          disabled={!selectedSlot || isReserving}
          onClick={onReserve}
          className="h-12 w-full touch-manipulation rounded-xl bg-[#C0FF00] px-6 text-xs font-black tracking-wide text-[#0B1A2D] uppercase hover:bg-[#C0FF00]/90 disabled:opacity-50 sm:h-12 sm:w-auto sm:px-8 sm:text-sm"
        >
          {t("reserveNow")}
        </Button>
      </div>
    </div>
  );
}
