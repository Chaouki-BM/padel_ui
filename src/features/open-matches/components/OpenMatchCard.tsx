"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type Match } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  CreditCard,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { PlayerSlot } from "@/features/open-matches/components/PlayerSlot";
import { authAwareHref } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";

type OpenMatchCardProps = {
  match: Match;
};

function LevelBadge({ match, t }: { match: Match; t: ReturnType<typeof useTranslations> }) {
  let label: string;
  let variant: "lime" | "default" = "default";

  if (match.allLevels) {
    label = t("allLevels");
    variant = "lime";
  } else if (match.levelMin && match.levelMax) {
    label = t("levelRange", { min: match.levelMin, max: match.levelMax });
  } else if (match.levelMin) {
    label = t("levelPlus", { level: match.levelMin });
  } else {
    label = t("allLevels");
    variant = "lime";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-bold ${
        variant === "lime"
          ? "border-[#C0FF00] bg-[#C0FF00]/10 text-[#0B2341] dark:text-[#C0FF00]"
          : "border-[#0B2341]/20 bg-[#0B2341]/5 text-[#0B2341] dark:border-white/20 dark:bg-white/5 dark:text-white"
      }`}
    >
      <Trophy className="h-3 w-3" />
      {label}
    </span>
  );
}

export function OpenMatchCard({ match }: OpenMatchCardProps) {
  const t = useTranslations("openMatchesPage");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const joinHref = authAwareHref(
    `/player/open-matches/${match.id}`,
    isAuthenticated,
  );

  // Build player slots array (fill empty slots with null)
  const slots = Array.from({ length: match.maxPlayers }, (_, i) =>
    i < match.players.length ? match.players[i] : null
  );

  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Almost full ribbon */}
      {match.almostFull && (
        <div className="absolute -right-0 top-3 flex items-center gap-1 rounded-l-md bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm">
          <AlertTriangle className="h-3 w-3" />
          {t("almostFull")}
        </div>
      )}

      {/* Header: Club name + price */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#0B2341] dark:text-white">
            {match.clubName}
          </h3>
          <div className="mt-0.5 flex items-center text-xs text-gray-400">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {match.clubLocation}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xl font-black text-[#0B2341] dark:text-white">
            {match.pricePerPlayer}
          </span>
          <span className="ml-1 text-xs font-bold text-[#0B2341] dark:text-white">
            {t("currency")}
          </span>
          <div className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
            {t("perPlayer")}
          </div>
        </div>
      </div>

      {/* Date, time & level */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#0B2341] dark:text-gray-300">
        <div className="flex items-center gap-1 font-medium">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          {match.date}
        </div>
        <div className="flex items-center gap-1 font-medium">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          {match.time}
        </div>
        <div className="ml-auto">
          <LevelBadge match={match} t={t} />
        </div>
      </div>

      {/* Player slots */}
      <div className="mt-5 flex items-start gap-4">
        {slots.map((player, i) => (
          <PlayerSlot key={player?.id ?? `empty-${i}`} player={player ?? null} />
        ))}
      </div>

      {/* Footer: payment + join button */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
          <CreditCard className="h-3.5 w-3.5" />
          {match.paymentMethod === "in_app" ? t("paymentInApp") : t("paymentOnSite")}
        </div>
        <Button
          asChild
          className="h-9 rounded-lg bg-[#C0FF00] px-5 text-xs font-bold text-[#0B2341] shadow-sm transition-colors hover:bg-[#B0EF00]"
        >
          <Link href={joinHref}>
            {isAuthenticated ? t("joinMatch") : t("joinMatchLogin")}
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
