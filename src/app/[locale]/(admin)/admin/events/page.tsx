"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  usePatchAdminMatchResult,
  useVoidAdminMatch,
} from "@/hooks/useAdmin";
import { useClubEvents } from "@/hooks/useClubDashboard";
import { cn } from "@/lib/utils";

export default function AdminEventsPage() {
  const t = useTranslations("adminEventsPage");
  const { data, isLoading, isError, refetch } = useClubEvents();
  const patchResult = usePatchAdminMatchResult();
  const voidMatch = useVoidAdminMatch();
  const [matchId, setMatchId] = useState("");
  const [scoreA, setScoreA] = useState("6");
  const [scoreB, setScoreB] = useState("4");

  async function onPatchResult() {
    if (!matchId.trim()) return;
    try {
      await patchResult.mutateAsync({
        matchId: matchId.trim(),
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
      });
      toast.success(t("resultOk"));
    } catch {
      toast.error(t("resultError"));
    }
  }

  async function onVoid() {
    if (!matchId.trim()) return;
    try {
      await voidMatch.mutateAsync(matchId.trim());
      toast.success(t("voidOk"));
    } catch {
      toast.error(t("voidError"));
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

  const busy = patchResult.isPending || voidMatch.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("matchDesk")}</h2>
        <div className="flex flex-wrap gap-2">
          <Input value={matchId} onChange={(e) => setMatchId(e.target.value)} placeholder={t("matchId")} className="h-10 flex-1" />
          <Input value={scoreA} onChange={(e) => setScoreA(e.target.value)} type="number" className="h-10 w-20" />
          <Input value={scoreB} onChange={(e) => setScoreB(e.target.value)} type="number" className="h-10 w-20" />
          <Button type="button" disabled={busy || !matchId.trim()} onClick={() => void onPatchResult()} className="h-10 rounded-xl bg-[#0B1A2D] text-[#C0FF00]">
            {t("correctResult")}
          </Button>
          <Button type="button" variant="outline" disabled={busy || !matchId.trim()} onClick={() => void onVoid()} className="h-10 rounded-xl text-rose-600">
            {t("voidMatch")}
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {(data ?? []).map((event) => (
          <li key={event.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-black text-[#0B1A2D]">{event.title}</h2>
              <span className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold",
                event.status === "live" && "bg-[#C0FF00] text-[#0B1A2D]",
                event.status === "upcoming" && "bg-sky-50 text-sky-700",
                event.status === "done" && "bg-slate-100 text-slate-500",
              )}>
                {t(`status.${event.status}`)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {event.date} · {event.timeRange} · {event.players} joueurs
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
