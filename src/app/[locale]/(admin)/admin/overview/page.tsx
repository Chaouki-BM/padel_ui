"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AdminActivityFeed } from "@/features/admin/components/AdminActivityFeed";
import { AdminGrowthChart } from "@/features/admin/components/AdminGrowthChart";
import { AdminKpiCards } from "@/features/admin/components/AdminKpiCards";
import { AdminUsersTable } from "@/features/admin/components/AdminUsersTable";
import { useAdminDashboard } from "@/hooks/useAdmin";

export default function AdminOverviewPage() {
  const t = useTranslations("adminDashboard");
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] animate-pulse space-y-4 px-4 py-6">
        <div className="h-10 w-80 rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <AdminKpiCards kpis={data.kpis} />

      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
        {(
          [
            ["overview", "/admin/overview"],
            ["users", "/admin/users"],
            ["clubs", "/admin/clubs"],
            ["payments", "/admin/payments"],
            ["sanctions", "/admin/complaints"],
          ] as const
        ).map(([key, href], index) => (
          <Link
            key={key}
            href={href}
            className={
              index === 0
                ? "rounded-full bg-[#0B1A2D] px-4 py-2 text-xs font-bold text-[#C0FF00]"
                : "rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-[#0B1A2D]"
            }
          >
            {t(`tabs.${key}`)}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          <AdminGrowthChart series={data.growthSeries} />
        </div>
        <div className="lg:col-span-4">
          <AdminActivityFeed activities={data.activities} />
        </div>
      </div>

      <AdminUsersTable users={data.recentUsers} />

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("systemsOk", { uptime: data.systemUptime })}
        </p>
        <p className="text-[10px] font-medium text-slate-400">{t("footer")}</p>
      </div>
    </div>
  );
}
