"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AdminGrowthChart } from "@/features/admin/components/AdminGrowthChart";
import { AdminKpiCards } from "@/features/admin/components/AdminKpiCards";
import { useAdminDashboard, useAdminPayments } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminFinancePage() {
  const t = useTranslations("adminFinancePage");
  const dash = useAdminDashboard();
  const payments = useAdminPayments();

  if (dash.isLoading || payments.isLoading) {
    return <div className="mx-auto max-w-[1100px] animate-pulse space-y-4 p-6"><div className="h-28 rounded-2xl bg-slate-100" /><div className="h-64 rounded-2xl bg-slate-100" /></div>;
  }

  if (dash.isError || !dash.data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void dash.refetch()} className="rounded-full bg-[#0B1A2D] text-white">{t("retry")}</Button>
      </div>
    );
  }

  const flagged = (payments.data ?? []).filter((p) => p.status === "flagged" || p.status === "failed");

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>
      <AdminKpiCards kpis={dash.data.kpis.filter((k) => k.id === "revenue" || k.id === "users")} />
      <AdminGrowthChart series={dash.data.growthSeries} />
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-black text-[#0B1A2D]">{t("alertsTitle")}</h2>
        {flagged.length === 0 ? (
          <p className="text-sm text-slate-500">{t("noAlerts")}</p>
        ) : (
          <ul className="space-y-2">
            {flagged.map((p) => (
              <li key={p.id} className={cn("rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm")}>
                <span className="font-bold text-[#0B1A2D]">{p.label}</span>
                <span className="text-slate-600"> — {p.amount} TND · {p.userName}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
