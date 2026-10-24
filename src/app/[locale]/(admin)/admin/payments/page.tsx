"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAdminPayments } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const t = useTranslations("adminPaymentsPage");
  const { data, isLoading, isError, refetch } = useAdminPayments();

  if (isLoading) {
    return <div className="mx-auto max-w-[1000px] animate-pulse p-6"><div className="h-64 rounded-2xl bg-slate-100" /></div>;
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
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {(data ?? []).map((pay) => (
            <li key={pay.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0B1A2D]">{pay.label}</p>
                <p className="text-xs text-slate-500">{pay.userName} · {pay.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold",
                  pay.status === "success" && "bg-emerald-50 text-emerald-700",
                  pay.status === "pending" && "bg-amber-50 text-amber-700",
                  pay.status === "failed" && "bg-rose-50 text-rose-600",
                  pay.status === "flagged" && "bg-orange-50 text-orange-700",
                )}>
                  {t(`status.${pay.status}`)}
                </span>
                <span className="text-sm font-black text-[#0B1A2D]">{pay.amount} TND</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
