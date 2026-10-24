"use client";

import { useTranslations } from "next-intl";
import { BookOpen, Filter, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CoachAlertsPanel } from "@/features/coach-space/components/CoachAlertsPanel";
import { CoachDashboardHero } from "@/features/coach-space/components/CoachDashboardHero";
import { CoachKpiCards } from "@/features/coach-space/components/CoachKpiCards";
import { CoachPerformanceBars } from "@/features/coach-space/components/CoachPerformanceBars";
import { CoachSessionsList } from "@/features/coach-space/components/CoachSessionsList";
import { CoachTodayAvailability } from "@/features/coach-space/components/CoachTodayAvailability";
import { useCoachSpaceDashboard } from "@/hooks/useCoachSpace";

export default function CoachDashboardPage() {
  const t = useTranslations("coachSpaceDashboard");
  const { data, isLoading, isError, refetch } = useCoachSpaceDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] animate-pulse space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-48 rounded-2xl bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm font-medium text-slate-500">{t("error")}</p>
        <Button
          onClick={() => void refetch()}
          className="rounded-full bg-[#0B1A2D] px-6 font-semibold text-white"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
      <CoachDashboardHero profile={data.profile} />
      <CoachKpiCards kpis={data.kpis} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
          <span className="rounded-full bg-[#0B1A2D] px-4 py-2 text-xs font-bold text-[#C0FF00]">
            {t("tabs.overview")}
          </span>
          <Link
            href="/coach-space/requests"
            className="rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-[#0B1A2D]"
          >
            {t("tabs.bookings")}
          </Link>
          <Link
            href="/coach-space/clients"
            className="rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-[#0B1A2D]"
          >
            {t("tabs.clients")}
          </Link>
          <span className="rounded-full px-4 py-2 text-xs font-bold text-slate-400">
            {t("tabs.reports")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-slate-200 text-xs font-semibold"
          >
            <Filter className="h-3.5 w-3.5" />
            {t("filter")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-slate-200 text-xs font-semibold"
          >
            <Search className="h-3.5 w-3.5" />
            {t("search")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-black text-[#0B1A2D]">
                {t("upcomingTitle")}
              </h2>
              <Link
                href="/coach-space/requests"
                className="text-xs font-bold text-[#0B1A2D] hover:underline"
              >
                {t("seeAll")}
              </Link>
            </div>
            <CoachSessionsList sessions={data.upcomingSessions} />
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-base font-black text-[#0B1A2D]">
              {t("performanceTitle")}
            </h2>
            <CoachPerformanceBars items={data.performance} />
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <CoachTodayAvailability
            label={data.todayLabel}
            slots={data.todaySlots}
          />
          <CoachAlertsPanel alerts={data.alerts} />
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#0B1A2D]" />
              <h3 className="text-sm font-black text-[#0B1A2D]">
                {t("resourcesTitle")}
              </h3>
            </div>
            <p className="mb-3 text-xs font-medium text-slate-500">
              {t("resourcesDesc")}
            </p>
            <Button
              type="button"
              className="h-10 w-full rounded-xl bg-[#0B1A2D] text-xs font-bold text-white"
            >
              {t("resourcesCta")}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
