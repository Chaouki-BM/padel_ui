"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useClubOffers,
  useCreateClubPromotion,
  useUpdateClubPromotion,
} from "@/hooks/useClubDashboard";
import { cn } from "@/lib/utils";

export default function ClubOffersPage() {
  const t = useTranslations("clubOffersPage");
  const { data, isLoading, isError, refetch } = useClubOffers();
  const createPromo = useCreateClubPromotion();
  const updatePromo = useUpdateClubPromotion();
  const [code, setCode] = useState("");
  const [value, setValue] = useState("15");

  async function onCreate() {
    const trimmed = code.trim();
    const percent = Number(value);
    if (!trimmed || !Number.isFinite(percent) || percent <= 0) return;
    try {
      await createPromo.mutateAsync({
        code: trimmed,
        type: "PERCENT",
        value: percent,
      });
      setCode("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function onToggle(id: string, active: boolean) {
    try {
      await updatePromo.mutateAsync({ id, body: { active: !active } });
      toast.success(t("updateOk"));
    } catch {
      toast.error(t("updateError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[800px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  const offers = data ?? [];
  const busy = createPromo.isPending || updatePromo.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("codePlaceholder")}
          className="h-11"
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          min={1}
          max={100}
          placeholder={t("percentPlaceholder")}
          className="h-11 sm:w-28"
        />
        <Button
          type="button"
          disabled={busy || !code.trim()}
          onClick={() => void onCreate()}
          className="h-11 shrink-0 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("create")}
        </Button>
      </div>

      {offers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className={cn(
                "rounded-2xl border p-5 shadow-sm",
                offer.active
                  ? "border-slate-100 bg-white"
                  : "border-slate-100 bg-slate-50 opacity-70",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-black text-[#0B1A2D]">
                    {offer.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {t("validUntil", { date: offer.validUntil })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F3FFCC] px-3 py-1 text-sm font-black text-[#0B1A2D]">
                    −{offer.discountPercent}%
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold",
                      offer.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    {offer.active ? t("active") : t("inactive")}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void onToggle(offer.id, offer.active)}
                    className="h-8 rounded-lg text-[11px]"
                  >
                    {offer.active ? t("deactivate") : t("activate")}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
