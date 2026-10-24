"use client";

import { useTranslations } from "next-intl";
import { MoreVertical } from "lucide-react";
import { type CoachSpaceSession } from "@/types";
import { cn } from "@/lib/utils";

type CoachSessionsListProps = {
  sessions: CoachSpaceSession[];
};

function statusClass(status: CoachSpaceSession["status"]) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "completed":
      return "bg-slate-100 text-slate-500";
  }
}

export function CoachSessionsList({ sessions }: CoachSessionsListProps) {
  const t = useTranslations("coachSpaceDashboard");

  if (sessions.length === 0) {
    return (
      <p className="py-8 text-center text-sm font-medium text-slate-500">
        {t("sessionsEmpty")}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {sessions.map((session) => (
        <li
          key={session.id}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B1A2D] text-xs font-black text-[#C0FF00]">
              {session.clientInitials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-[#0B1A2D]">
                  {session.clientName}
                </p>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
                  {t(`sessionTypes.${session.sessionType}`)}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {session.dateLabel} · {session.startTime} – {session.endTime} ·{" "}
                {t("duration", { minutes: session.durationMinutes })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-bold",
                statusClass(session.status),
              )}
            >
              {t(`sessionStatus.${session.status}`)}
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label={t("moreActions")}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
