"use client";

import { useTranslations } from "next-intl";
import {
  Building2,
  CircleDollarSign,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { type AdminActivity } from "@/types";

const ICONS = {
  club: Building2,
  payment: CircleDollarSign,
  users: Users,
  sanction: ShieldAlert,
  system: Settings,
} as const;

type AdminActivityFeedProps = {
  activities: AdminActivity[];
};

export function AdminActivityFeed({ activities }: AdminActivityFeedProps) {
  const t = useTranslations("adminDashboard");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="text-base font-black text-[#0B1A2D]">
          {t("activityTitle")}
        </h2>
      </div>
      <ul className="divide-y divide-slate-100">
        {activities.map((item) => {
          const Icon = ICONS[item.type];
          return (
            <li key={item.id} className="flex gap-3 px-4 py-3 sm:px-5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0B1A2D]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0B1A2D]">{item.title}</p>
                <p className="text-xs font-medium text-slate-500">
                  {item.description}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  {item.timeAgo}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-slate-100 px-4 py-3 text-center sm:px-5">
        <span className="text-[11px] font-bold tracking-wide text-[#0B1A2D] uppercase">
          {t("seeAllHistory")}
        </span>
      </div>
    </div>
  );
}
