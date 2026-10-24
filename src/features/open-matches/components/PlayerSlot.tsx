"use client";

import { useTranslations } from "next-intl";
import { type OpenMatchPlayer } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

type PlayerSlotProps = {
  player: OpenMatchPlayer | null;
};

export function PlayerSlot({ player }: PlayerSlotProps) {
  const t = useTranslations("openMatchesPage");

  if (!player) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Plus className="h-4 w-4 text-gray-400" />
        </div>
        <span className="text-[10px] font-medium text-gray-400 uppercase">
          {t("playerSlotFree")}
        </span>
      </div>
    );
  }

  // Determine avatar color based on level
  const levelColors: Record<string, string> = {
    P25: "bg-lime-400",
    P50: "bg-lime-500",
    P100: "bg-emerald-500",
    P250: "bg-teal-500",
    P500: "bg-amber-500",
    P1000: "bg-red-500",
  };

  const bgColor = levelColors[player.level] ?? "bg-gray-400";
  const initials = player.displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1">
      <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-800">
        {player.avatarUrl ? (
          <AvatarImage src={player.avatarUrl} alt={player.displayName} />
        ) : null}
        <AvatarFallback className={`${bgColor} text-white text-sm font-bold`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-[11px] font-semibold text-[#0B2341] dark:text-white">
        {player.displayName}
      </span>
      <span className="rounded-sm bg-[#0B2341] px-1.5 py-0.5 text-[9px] font-bold text-white">
        {player.level}
      </span>
    </div>
  );
}
