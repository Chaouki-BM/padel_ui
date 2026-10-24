"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminComplaints, useResolveAppeal } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminComplaintsPage() {
  const t = useTranslations("adminComplaintsPage");
  const { data, isLoading, isError, refetch } = useAdminComplaints();
  const resolve = useResolveAppeal();

  async function onResolve(id: string, accept: boolean) {
    try {
      await resolve.mutateAsync({ appealId: id, accept });
      toast.success(accept ? t("acceptOk") : t("rejectOk"));
    } catch {
      toast.error(t("actionError"));
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-[900px] animate-pulse space-y-3 p-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100" />)}</div>;
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
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>
      <ul className="flex flex-col gap-3">
        {(data ?? []).map((c) => (
          <li key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-black text-[#0B1A2D]">{c.subject}</h2>
              <span className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold",
                c.status === "open" && "bg-rose-50 text-rose-600",
                c.status === "in_progress" && "bg-amber-50 text-amber-700",
                c.status === "resolved" && "bg-emerald-50 text-emerald-700",
              )}>
                {t(`status.${c.status}`)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{c.fromName} · {c.createdAt}</p>
            {c.status !== "resolved" ? (
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={resolve.isPending}
                  onClick={() => void onResolve(c.id, true)}
                  className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                >
                  {t("accept")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={resolve.isPending}
                  onClick={() => void onResolve(c.id, false)}
                  className="h-8 rounded-lg text-[11px]"
                >
                  {t("reject")}
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
