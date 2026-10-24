"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminAdvertisements,
  useCreateAdminAdvertisement,
  usePatchAdminAdvertisement,
} from "@/hooks/useAds";
import { cn } from "@/lib/utils";

export default function AdminAdsPage() {
  const t = useTranslations("adminAdsPage");
  const { data, isLoading, isError, refetch } = useAdminAdvertisements();
  const createAd = useCreateAdminAdvertisement();
  const patchAd = usePatchAdminAdvertisement();
  const [title, setTitle] = useState("");

  async function onCreate() {
    if (!title.trim()) return;
    try {
      await createAd.mutateAsync({
        title: title.trim(),
        placement: "HOME",
        imageUrl:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
      });
      setTitle("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function onToggle(id: string, active: boolean) {
    try {
      await patchAd.mutateAsync({ id, body: { active: !active } });
      toast.success(t("updateOk"));
    } catch {
      toast.error(t("updateError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[700px] animate-pulse space-y-3 p-6">
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  const ads = data ?? [];
  const busy = createAd.isPending || patchAd.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("titlePlaceholder")}
          className="h-11"
        />
        <Button
          type="button"
          disabled={busy || !title.trim()}
          onClick={() => void onCreate()}
          className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("create")}
        </Button>
      </div>

      {ads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ads.map((ad) => (
            <li
              key={ad.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-sm font-bold text-[#0B1A2D]">{ad.title}</p>
                <p className="text-xs text-slate-500">{ad.placement}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold",
                    ad.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {ad.active ? t("active") : t("inactive")}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void onToggle(ad.id, ad.active)}
                  className="h-8 rounded-lg text-[11px]"
                >
                  {ad.active ? t("deactivate") : t("activate")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
