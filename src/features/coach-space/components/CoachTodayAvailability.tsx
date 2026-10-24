"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { type CoachDaySlot } from "@/types";
import { cn } from "@/lib/utils";

type CoachTodayAvailabilityProps = {
  label: string;
  slots: CoachDaySlot[];
};

export function CoachTodayAvailability({
  label,
  slots,
}: CoachTodayAvailabilityProps) {
  const t = useTranslations("coachSpaceDashboard");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0B1A2D]">
          {t("availabilityTitle")}
        </h3>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
          {t("live")}
        </span>
      </div>
      <p className="mb-3 text-xs font-medium text-slate-500">{label}</p>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={cn(
              "rounded-xl border px-2.5 py-2 text-center text-xs font-bold",
              slot.status === "occupied"
                ? "border-slate-100 bg-slate-50 text-slate-400"
                : "border-[#C0FF00]/50 bg-[#F3FFCC] text-[#0B1A2D]",
            )}
          >
            <div>{slot.time}</div>
            <div className="mt-0.5 text-[10px] uppercase">
              {t(`slotStatus.${slot.status}`)}
            </div>
          </div>
        ))}
      </div>
      <Button
        asChild
        className="h-10 w-full rounded-xl bg-[#0B1A2D] text-xs font-bold text-[#C0FF00] hover:bg-[#0B1A2D]/90"
      >
        <Link href="/coach-space/availability">{t("manageSchedule")}</Link>
      </Button>
    </div>
  );
}
