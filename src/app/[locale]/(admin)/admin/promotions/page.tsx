"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminPromotions,
  useCreateAdminPromotion,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminPromotionsPage() {
  const t = useTranslations("adminPromotionsPage");
  const { data, isLoading, isError, refetch } = useAdminPromotions();
  const createPromo = useCreateAdminPromotion();
  const [code, setCode] = useState("");
  const [value, setValue] = useState("10");

  async function onCreate() {
    const percent = Number(value);
    if (!code.trim() || !Number.isFinite(percent)) return;
    try {
      await createPromo.mutateAsync({
        code: code.trim(),
        type: "PERCENT",
        value: percent,
      });
      setCode("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-[800px] animate-pulse space-y-3 p-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100" />)}</div>;
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">{t("retry")}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("codePlaceholder")} className="h-11" />
        <Input value={value} onChange={(e) => setValue(e.target.value)} type="number" className="h-11 sm:w-28" />
        <Button type="button" disabled={createPromo.isPending || !code.trim()} onClick={() => void onCreate()} className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]">
          {t("create")}
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {(data ?? []).map((offer) => (
          <li key={offer.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-bold text-[#0B1A2D]">{offer.title}</p>
              <p className="text-xs text-slate-500">{offer.validUntil}</p>
            </div>
            <span className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold",
              offer.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}>
              −{offer.discountPercent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
