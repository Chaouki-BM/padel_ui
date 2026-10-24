"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdvanceEventBracket,
  useCancelClubEvent,
  useClubEvents,
  useCreateClubEvent,
  useNextEventRound,
  usePatchClubEvent,
  usePublishClubEvent,
  useScoreEventMatch,
  useStartClubEvent,
  useStartEventBracket,
  useStartEventGroups,
} from "@/hooks/useClubDashboard";
import { cn } from "@/lib/utils";

export default function ClubEventsPage() {
  const t = useTranslations("clubEventsPage");
  const { data, isLoading, isError, refetch } = useClubEvents();
  const createEvent = useCreateClubEvent();
  const publishEvent = usePublishClubEvent();
  const startEvent = useStartClubEvent();
  const cancelEvent = useCancelClubEvent();
  const patchEvent = usePatchClubEvent();
  const nextRound = useNextEventRound();
  const scoreMatch = useScoreEventMatch();
  const startGroups = useStartEventGroups();
  const startBracket = useStartEventBracket();
  const advanceBracket = useAdvanceEventBracket();
  const [title, setTitle] = useState("");
  const [deskId, setDeskId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState("");
  const [scoreA, setScoreA] = useState("16");
  const [scoreB, setScoreB] = useState("16");
  const [editTitle, setEditTitle] = useState("");

  async function onCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      await createEvent.mutateAsync({
        type: "AMERICANO",
        title: trimmed,
        startAt: new Date(Date.now() + 7 * 86400_000).toISOString(),
        roundsCount: 4,
        pointsPerMatch: 32,
        maxPlayers: 16,
      });
      setTitle("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function run(action: () => Promise<unknown>, ok: string) {
    try {
      await action();
      toast.success(t(ok as "publishOk"));
    } catch {
      toast.error(t("actionError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[900px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100" />
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

  const events = data ?? [];
  const busy =
    createEvent.isPending ||
    publishEvent.isPending ||
    startEvent.isPending ||
    cancelEvent.isPending ||
    patchEvent.isPending ||
    nextRound.isPending ||
    scoreMatch.isPending ||
    startGroups.isPending ||
    startBracket.isPending ||
    advanceBracket.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
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
          className="h-11 shrink-0 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("create")}
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black text-[#0B1A2D]">
                      {event.title}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                        event.status === "live" && "bg-[#C0FF00] text-[#0B1A2D]",
                        event.status === "upcoming" && "bg-sky-50 text-sky-700",
                        event.status === "done" && "bg-slate-100 text-slate-500",
                      )}
                    >
                      {t(`status.${event.status}`)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    {event.date} · {event.timeRange} ·{" "}
                    {t("players", { count: event.players })}
                  </p>
                </div>
                {event.status !== "done" ? (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => publishEvent.mutateAsync(event.id), "publishOk")} className="h-8 rounded-lg text-[11px]">{t("publish")}</Button>
                    <Button type="button" size="sm" disabled={busy} onClick={() => void run(() => startEvent.mutateAsync(event.id), "startOk")} className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]">{t("start")}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => { setDeskId(event.id); setEditTitle(event.title); }} className="h-8 rounded-lg text-[11px]">{t("desk")}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => cancelEvent.mutateAsync(event.id), "cancelOk")} className="h-8 rounded-lg text-[11px] text-rose-600">{t("cancel")}</Button>
                  </div>
                ) : null}
              </div>

              {deskId === event.id ? (
                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex flex-wrap gap-2">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-9 flex-1 text-xs" />
                    <Button type="button" size="sm" disabled={busy} onClick={() => void run(() => patchEvent.mutateAsync({ eventId: event.id, body: { title: editTitle.trim() } }), "editOk")} className="h-9 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]">{t("saveEdit")}</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => nextRound.mutateAsync(event.id), "roundOk")} className="h-8 text-[11px]">{t("nextRound")}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => startGroups.mutateAsync({ eventId: event.id, groupsCount: 4 }), "groupsOk")} className="h-8 text-[11px]">{t("startGroups")}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => startBracket.mutateAsync({ eventId: event.id, fromGroups: true }), "bracketOk")} className="h-8 text-[11px]">{t("startBracket")}</Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => advanceBracket.mutateAsync(event.id), "bracketNextOk")} className="h-8 text-[11px]">{t("bracketNext")}</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Input value={matchId} onChange={(e) => setMatchId(e.target.value)} placeholder={t("matchId")} className="h-9 w-36 text-xs" />
                    <Input value={scoreA} onChange={(e) => setScoreA(e.target.value)} type="number" className="h-9 w-16 text-xs" />
                    <Input value={scoreB} onChange={(e) => setScoreB(e.target.value)} type="number" className="h-9 w-16 text-xs" />
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy || !matchId.trim()}
                      onClick={() =>
                        void run(
                          () =>
                            scoreMatch.mutateAsync({
                              eventId: event.id,
                              matchId: matchId.trim(),
                              scoreA: Number(scoreA),
                              scoreB: Number(scoreB),
                            }),
                          "scoreOk",
                        )
                      }
                      className="h-9 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                    >
                      {t("score")}
                    </Button>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
