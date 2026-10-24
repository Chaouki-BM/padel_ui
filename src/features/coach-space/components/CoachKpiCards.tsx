"use client";

import { useTranslations } from "next-intl";
import {
  CalendarDays,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { type CoachSpaceKpi } from "@/types";
import { cn } from "@/lib/utils";

const KPI_ICONS = {
  revenue: TrendingUp,
  sessions: CalendarDays,
  clients: Users,
  rating: Star,
} as const;

type CoachKpiCardsProps = {
  kpis: CoachSpaceKpi[];
};

export function CoachKpiCards({ kpis }: CoachKpiCardsProps) {
  const t = useTranslations("coachSpaceDashboard.kpis");

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {kpis.map((kpi) => {
        const Icon =
          KPI_ICONS[kpi.id as keyof typeof KPI_ICONS] ?? TrendingUp;
        return (
          <article
            key={kpi.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {t(`${kpi.id}.label`)}
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3FFCC] text-[#0B1A2D]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="text-xl font-black text-[#0B1A2D] sm:text-2xl">
              {kpi.value}
            </p>
            <p
              className={cn(
                "mt-1 text-xs font-semibold",
                kpi.trendPositive ? "text-emerald-600" : "text-rose-500",
              )}
            >
              {kpi.trend} {t(`${kpi.id}.hint`)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
