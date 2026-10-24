"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useAdminSettings,
  useDeleteAdminSetting,
  usePutAdminSetting,
} from "@/hooks/useAdmin";

export default function AdminSettingsPage() {
  const t = useTranslations("adminSettingsPage");
  const { data, isLoading, isError, refetch } = useAdminSettings();
  const putSetting = usePutAdminSetting();
  const deleteSetting = useDeleteAdminSetting();

  async function onSave(key: string, value: unknown) {
    try {
      await putSetting.mutateAsync({ key, value });
      toast.success(t("savedToast"));
    } catch {
      toast.error(t("saveError"));
    }
  }

  async function onDelete(key: string) {
    try {
      await deleteSetting.mutateAsync(key);
      toast.success(t("deletedToast"));
    } catch {
      toast.error(t("deleteError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[700px] animate-pulse space-y-3 p-6">
        <div className="h-40 rounded-2xl bg-slate-100" />
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

  const keys = Object.keys(data ?? {});
  const busy = putSetting.isPending || deleteSetting.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {keys.length === 0 ? (
          <p className="text-sm text-slate-500">{t("empty")}</p>
        ) : (
          keys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 border-b border-slate-50 py-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0B1A2D]">{key}</p>
                <p className="truncate text-xs text-slate-500">
                  {JSON.stringify(data?.[key])}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="h-9 rounded-xl text-xs font-semibold"
                  onClick={() => void onSave(key, data?.[key])}
                >
                  {t("configure")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  className="h-9 rounded-xl text-xs font-semibold text-rose-600"
                  onClick={() => void onDelete(key)}
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
