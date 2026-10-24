"use client";

import { useTranslations } from "next-intl";
import { type CoachPerformanceItem } from "@/types";

type CoachPerformanceBarsProps = {
  items: CoachPerformanceItem[];
};

export function CoachPerformanceBars({ items }: CoachPerformanceBarsProps) {
  const t = useTranslations("coachSpaceDashboard");

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.sessionType}>
          <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600">
              {t(`performance.${item.sessionType}`)}
            </span>
            <span className="text-[#0B1A2D]">
              {item.count} ({item.percent}%)
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0B1A2D]"
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
