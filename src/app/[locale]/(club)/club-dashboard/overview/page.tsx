"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClubKpiCards } from "@/features/club-dashboard/components/ClubKpiCards";
import { ClubReservationsTable } from "@/features/club-dashboard/components/ClubReservationsTable";
import { ClubRevenueChart } from "@/features/club-dashboard/components/ClubRevenueChart";
import { ClubSidebarWidgets } from "@/features/club-dashboard/components/ClubSidebarWidgets";
import {
  useClubDashboard,
  usePatchMyClub,
} from "@/hooks/useClubDashboard";

export default function ClubOverviewPage() {
  const t = useTranslations("clubDashboard");
  const { data, isLoading, isError, refetch } = useClubDashboard();
  const patchClub = usePatchMyClub();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  function openEdit() {
    if (!data) return;
    setName(data.clubName);
    setCity("");
    setPhone("");
    setDescription("");
    setEditing(true);
  }

  async function onSaveClub() {
    try {
      await patchClub.mutateAsync({
        name: name.trim() || undefined,
        city: city.trim() || undefined,
        phone: phone.trim() || undefined,
        description: description.trim() || undefined,
      });
      toast.success(t("clubSaved"));
      setEditing(false);
    } catch {
      toast.error(t("clubSaveError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] animate-pulse space-y-4 px-4 py-6">
        <div className="h-10 w-72 rounded bg-slate-200" />
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
          className="rounded-full bg-[#0B1A2D] text-white"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("subtitle")} · {data.clubName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openEdit}
            className="h-11 rounded-xl border-slate-200 text-xs font-semibold"
          >
            {t("editClub")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.message(t("exportToast"))}
            className="h-11 rounded-xl border-slate-200 text-xs font-semibold"
          >
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button
            type="button"
            onClick={() => toast.success(t("newBookingToast"))}
            className="h-11 rounded-xl bg-[#0B1A2D] text-xs font-bold text-[#C0FF00]"
          >
            <Plus className="h-4 w-4" />
            {t("newBooking")}
          </Button>
        </div>
      </header>

      {editing ? (
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-black text-[#0B1A2D]">{t("editClubTitle")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} className="h-10" />
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("cityPlaceholder")} className="h-10" />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phonePlaceholder")} className="h-10" />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("descPlaceholder")} className="h-10" />
          </div>
          <div className="flex gap-2">
            <Button type="button" disabled={patchClub.isPending} onClick={() => void onSaveClub()} className="h-10 rounded-xl bg-[#0B1A2D] text-[#C0FF00]">
              {t("saveClub")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)} className="h-10 rounded-xl">
              {t("cancelEdit")}
            </Button>
          </div>
        </div>
      ) : null}

      <ClubKpiCards kpis={data.kpis} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#0B1A2D] px-4 py-2 text-xs font-bold text-[#C0FF00]">
          {t("tabs.overview")}
        </span>
        <Link
          href="/club-dashboard/offers"
          className="rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
        >
          {t("tabs.pricing")}
        </Link>
        <Link
          href="/club-dashboard/courts"
          className="rounded-full px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
        >
          {t("tabs.courts")}
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <ClubRevenueChart
            series={data.revenueSeries}
            goal={data.revenueGoal}
          />
          <ClubReservationsTable reservations={data.recentReservations} />
        </div>
        <div className="lg:col-span-4">
          <ClubSidebarWidgets agenda={data.agenda} weather={data.weather} />
        </div>
      </div>

      <p className="pt-2 text-center text-[10px] font-medium tracking-wide text-slate-400 uppercase">
        {t("footerVersion")}
      </p>
    </div>
  );
}
