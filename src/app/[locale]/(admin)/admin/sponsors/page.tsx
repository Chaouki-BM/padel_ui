"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminKpiCards } from "@/features/admin/components/AdminKpiCards";
import {
  useCreateAdminSponsor,
  useSponsorDashboard,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminSponsorsPage() {
  const t = useTranslations("adminSponsors");
  const { data, isLoading, isError, refetch } = useSponsorDashboard();
  const createSponsor = useCreateAdminSponsor();
  const [sponsorName, setSponsorName] = useState("");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] animate-pulse space-y-4 px-4 py-6">
        <div className="h-10 w-72 rounded bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.message(t("exportToast"))}
            className="h-11 rounded-xl text-xs font-semibold"
          >
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button
            type="button"
            disabled={createSponsor.isPending || !sponsorName.trim()}
            onClick={() => {
              void createSponsor
                .mutateAsync({ name: sponsorName.trim() })
                .then(() => {
                  setSponsorName("");
                  toast.success(t("newCampaignToast"));
                })
                .catch(() => toast.error(t("createError")));
            }}
            className="h-11 rounded-xl bg-[#0B1A2D] text-xs font-bold text-[#C0FF00]"
          >
            <Plus className="h-4 w-4" />
            {t("newCampaign")}
          </Button>
        </div>
      </header>

      <div className="flex gap-2">
        <Input
          value={sponsorName}
          onChange={(e) => setSponsorName(e.target.value)}
          placeholder={t("sponsorPlaceholder")}
          className="h-11 max-w-sm"
        />
      </div>

      <AdminKpiCards kpis={data.kpis} namespaceKey="adminSponsors.kpis" />

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-base font-black text-[#0B1A2D]">
              {t("performanceTitle")}
            </h2>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.performanceSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name={t("series.impressions")}
                    stroke="#0B1A2D"
                    fill="#0B1A2D22"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    name={t("series.clicks")}
                    stroke="#84cc16"
                    fill="#C0FF0044"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <h2 className="text-base font-black text-[#0B1A2D]">
                {t("campaignsTitle")}
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {data.campaigns.map((c) => {
                const pct =
                  c.budgetTotal === 0
                    ? 0
                    : Math.round((c.budgetUsed / c.budgetTotal) * 100);
                return (
                  <li
                    key={c.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={c.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0B1A2D]">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.sponsorName}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-bold",
                        c.status === "active" && "bg-emerald-50 text-emerald-700",
                        c.status === "paused" && "bg-amber-50 text-amber-700",
                        c.status === "draft" && "bg-slate-100 text-slate-500",
                        c.status === "ended" && "bg-sky-50 text-sky-700",
                      )}
                    >
                      {t(`campaignStatus.${c.status}`)}
                    </span>
                    <div className="text-xs font-medium text-slate-600 sm:w-32">
                      {c.impressions.toLocaleString("fr-TN")} · {c.ctr}% CTR
                    </div>
                    <div className="sm:w-36">
                      <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500">
                        <span>{pct}%</span>
                        <span>
                          {c.budgetUsed}/{c.budgetTotal}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#0B1A2D]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-black text-[#0B1A2D]">{t("tipsTitle")}</h3>
            <ul className="space-y-3">
              {data.tips.map((tip) => (
                <li key={tip.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-bold text-[#0B1A2D]">{tip.title}</p>
                  <p className="text-xs text-slate-500">{tip.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-[#0B1A2D] p-5 text-white">
            <div className="relative mb-3 h-28 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80"
                alt=""
                fill
                className="object-cover opacity-80"
                sizes="400px"
              />
            </div>
            <p className="text-sm font-black">{t("premiumTitle")}</p>
            <p className="mt-1 text-xs text-white/70">{t("premiumDesc")}</p>
            <Button
              type="button"
              onClick={() => toast.message(t("reserveSpaceToast"))}
              className="mt-4 h-10 w-full rounded-xl bg-[#C0FF00] text-xs font-bold text-[#0B1A2D]"
            >
              <Plus className="h-4 w-4" />
              {t("reserveSpace")}
            </Button>
          </div>
        </aside>
      </div>

      <section>
        <h2 className="mb-3 text-base font-black text-[#0B1A2D]">{t("partnersTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {data.partners.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm"
            >
              <Shield className="h-6 w-6 text-slate-400" />
              <p className="text-xs font-bold text-[#0B1A2D]">{p.name}</p>
              <p className="text-[10px] text-slate-500">{p.city}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
