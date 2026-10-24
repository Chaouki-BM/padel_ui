"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCoachSpaceClients,
  useCreateCoachAssessment,
} from "@/hooks/useCoachSpace";
import { LEVEL_CODES, type LevelCode } from "@/lib/constants";

export default function CoachClientsPage() {
  const t = useTranslations("coachSpaceClients");
  const { data, isLoading, isError, refetch } = useCoachSpaceClients();
  const assess = useCreateCoachAssessment();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [level, setLevel] = useState<LevelCode>("P100");

  async function onAssess(playerId: string) {
    try {
      await assess.mutateAsync({ playerId, level });
      toast.success(t("assessOk"));
      setActiveId(null);
    } catch {
      toast.error(t("assessError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
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

  const clients = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("subtitle", { count: clients.length })}
        </p>
      </header>

      {clients.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm font-medium text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="hidden grid-cols-12 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase sm:grid">
            <div className="col-span-3">{t("columns.client")}</div>
            <div className="col-span-2">{t("columns.level")}</div>
            <div className="col-span-2">{t("columns.sessions")}</div>
            <div className="col-span-2">{t("columns.last")}</div>
            <div className="col-span-1 text-right">{t("columns.spent")}</div>
            <div className="col-span-2 text-right">{t("columns.assess")}</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {clients.map((client) => (
              <li
                key={client.id}
                className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-12 sm:items-center sm:gap-2"
              >
                <div className="flex items-center gap-3 sm:col-span-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1A2D] text-xs font-black text-[#C0FF00]">
                    {client.initials}
                  </div>
                  <p className="text-sm font-bold text-[#0B1A2D]">
                    {client.displayName}
                  </p>
                </div>
                <div className="text-sm font-semibold text-slate-600 sm:col-span-2">
                  {client.level}
                </div>
                <div className="text-sm font-semibold text-slate-600 sm:col-span-2">
                  {client.sessionsCount}
                </div>
                <div className="text-sm font-medium text-slate-500 sm:col-span-2">
                  {client.lastSessionAt}
                </div>
                <div className="text-sm font-black text-[#0B1A2D] sm:col-span-1 sm:text-right">
                  {client.totalSpent} TND
                </div>
                <div className="sm:col-span-2 sm:text-right">
                  {activeId === client.id ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as LevelCode)}
                        className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                      >
                        {LEVEL_CODES.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        disabled={assess.isPending}
                        onClick={() => void onAssess(client.id)}
                        className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                      >
                        {t("confirmAssess")}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveId(client.id)}
                      className="h-8 rounded-lg text-[11px]"
                    >
                      {t("assess")}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
