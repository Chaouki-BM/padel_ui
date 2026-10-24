"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCheckInBooking,
  useMarkNoShow,
} from "@/hooks/useClubDashboard";
import { type ClubRecentReservation } from "@/types";
import { cn } from "@/lib/utils";

type ClubReservationsTableProps = {
  reservations: ClubRecentReservation[];
  showActions?: boolean;
};

function statusClass(status: ClubRecentReservation["status"]) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700";
    case "pending":
      return "bg-slate-100 text-slate-600";
    case "paid":
      return "bg-amber-50 text-amber-700";
    case "cancelled":
      return "bg-rose-50 text-rose-600";
  }
}

export function ClubReservationsTable({
  reservations,
  showActions = true,
}: ClubReservationsTableProps) {
  const t = useTranslations("clubDashboard");
  const checkIn = useCheckInBooking();
  const noShow = useMarkNoShow();

  async function onCheckIn(id: string) {
    try {
      await checkIn.mutateAsync(id);
      toast.success(t("actions.checkInOk"));
    } catch {
      toast.error(t("actions.checkInError"));
    }
  }

  async function onNoShow(id: string) {
    try {
      await noShow.mutateAsync(id);
      toast.success(t("actions.noShowOk"));
    } catch {
      toast.error(t("actions.noShowError"));
    }
  }

  const busy = checkIn.isPending || noShow.isPending;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="text-base font-black text-[#0B1A2D]">
          {t("reservationsTitle")}
        </h2>
        <span className="text-xs font-bold text-[#0B1A2D]">{t("seeAll")}</span>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {reservations.map((row) => (
          <li key={row.id} className="flex flex-col gap-2 px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#0B1A2D]">{row.playerName}</p>
                <p className="text-[11px] font-medium text-slate-400">{row.id}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold",
                  statusClass(row.status),
                )}
              >
                {t(`status.${row.status}`)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                {row.courtName} · {row.timeRange}
              </span>
              <span className="font-black text-[#0B1A2D]">{row.price} TND</span>
            </div>
            {showActions && row.status !== "cancelled" && row.status !== "paid" ? (
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  disabled={busy}
                  onClick={() => void onCheckIn(row.id)}
                  className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                >
                  {t("actions.checkIn")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void onNoShow(row.id)}
                  className="h-8 rounded-lg text-[11px]"
                >
                  {t("actions.noShow")}
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <th className="px-4 py-3">{t("columns.id")}</th>
              <th className="px-4 py-3">{t("columns.player")}</th>
              <th className="px-4 py-3">{t("columns.court")}</th>
              <th className="px-4 py-3">{t("columns.time")}</th>
              <th className="px-4 py-3">{t("columns.status")}</th>
              <th className="px-4 py-3 text-right">{t("columns.price")}</th>
              {showActions ? (
                <th className="px-4 py-3 text-right">{t("columns.actions")}</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {reservations.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-4 py-3 font-bold text-slate-500">{row.id}</td>
                <td className="px-4 py-3 font-semibold text-[#0B1A2D]">
                  {row.playerName}
                </td>
                <td className="px-4 py-3 text-slate-600">{row.courtName}</td>
                <td className="px-4 py-3 text-slate-600">{row.timeRange}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      statusClass(row.status),
                    )}
                  >
                    {t(`status.${row.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-black text-[#0B1A2D]">
                  {row.price} TND
                </td>
                {showActions ? (
                  <td className="px-4 py-3 text-right">
                    {row.status !== "cancelled" && row.status !== "paid" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={busy}
                          onClick={() => void onCheckIn(row.id)}
                          className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                        >
                          {t("actions.checkIn")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void onNoShow(row.id)}
                          className="h-8 rounded-lg text-[11px]"
                        >
                          {t("actions.noShow")}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
