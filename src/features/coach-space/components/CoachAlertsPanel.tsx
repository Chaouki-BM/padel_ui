"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, CreditCard, Star } from "lucide-react";
import { type CoachAlert } from "@/types";

type CoachAlertsPanelProps = {
  alerts: CoachAlert[];
};

const ICONS = {
  payment: CreditCard,
  review: Star,
  document: AlertTriangle,
} as const;

export function CoachAlertsPanel({ alerts }: CoachAlertsPanelProps) {
  const t = useTranslations("coachSpaceDashboard");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="bg-[#0B1A2D] px-4 py-3">
        <h3 className="text-sm font-black text-white">{t("alertsTitle")}</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {alerts.map((alert) => {
          const Icon = ICONS[alert.type];
          return (
            <li key={alert.id} className="flex gap-3 px-4 py-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0B1A2D]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0B1A2D]">{alert.title}</p>
                <p className="text-xs font-medium text-slate-500">
                  {alert.description}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  {alert.timeAgo}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
