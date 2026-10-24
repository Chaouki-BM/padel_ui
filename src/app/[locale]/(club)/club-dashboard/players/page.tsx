"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  useClubPlayers,
  usePlayerBehaviour,
} from "@/hooks/useClubDashboard";

function BehaviourPanel({ playerId }: { playerId: string }) {
  const t = useTranslations("clubPlayersPage");
  const { data, isLoading, isError } = usePlayerBehaviour(playerId, true);

  if (isLoading) {
    return <p className="mt-2 text-xs text-slate-400">{t("behaviourLoading")}</p>;
  }
  if (isError || !data) {
    return <p className="mt-2 text-xs text-rose-500">{t("behaviourError")}</p>;
  }
  return (
    <p className="mt-2 text-xs font-medium text-slate-600">
      {t("behaviourSummary", {
        bookings: data.bookingsCount,
        noShows: data.noShows,
        cancellations: data.cancellations,
        status: data.status,
      })}
    </p>
  );
}

export default function ClubPlayersPage() {
  const t = useTranslations("clubPlayersPage");
  const { data, isLoading, isError, refetch } = useClubPlayers();
  const [openId, setOpenId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-100" />
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

  const players = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("subtitle", { count: players.length })}
        </p>
      </header>

      {players.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {players.map((player) => (
            <li key={player.id} className="px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1A2D] text-xs font-black text-[#C0FF00]">
                    {player.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B1A2D]">{player.displayName}</p>
                    <p className="text-xs text-slate-500">
                      {player.level} · {t("bookings", { count: player.bookingsCount })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#0B1A2D]">
                    {player.totalSpent} TND
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setOpenId((id) => (id === player.id ? null : player.id))
                    }
                    className="h-8 rounded-lg text-[11px]"
                  >
                    {t("behaviour")}
                  </Button>
                </div>
              </div>
              {openId === player.id ? <BehaviourPanel playerId={player.id} /> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
