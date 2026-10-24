"use client";

import { useTranslations } from "next-intl";
import { MoreVertical } from "lucide-react";
import { type AdminUser } from "@/types";
import { cn } from "@/lib/utils";

type AdminUsersTableProps = {
  users: AdminUser[];
  titleKey?: string;
};

function statusBadgeClass(status: AdminUser["status"]) {
  return cn(
    "rounded-full px-2.5 py-1 text-[11px] font-bold",
    status === "active" && "bg-emerald-50 text-emerald-700",
    status === "inactive" && "bg-slate-100 text-slate-500",
    status === "sanctioned" && "bg-rose-50 text-rose-600",
  );
}

function ReliabilityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 80
              ? "bg-emerald-500"
              : value >= 50
                ? "bg-amber-400"
                : "bg-rose-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-600">{value}%</span>
    </div>
  );
}

export function AdminUsersTable({
  users,
  titleKey = "usersTitle",
}: AdminUsersTableProps) {
  const t = useTranslations("adminDashboard");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="text-base font-black text-[#0B1A2D]">{t(titleKey)}</h2>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {users.map((user) => (
          <li key={user.id} className="flex flex-col gap-2 px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0B1A2D]">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <span className={statusBadgeClass(user.status)}>
                {t(`userStatus.${user.status}`)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-600">{user.roleLabel}</span>
              <ReliabilityBar value={user.reliability} />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <th className="px-4 py-3">{t("columns.user")}</th>
              <th className="px-4 py-3">{t("columns.role")}</th>
              <th className="px-4 py-3">{t("columns.status")}</th>
              <th className="px-4 py-3">{t("columns.reliability")}</th>
              <th className="px-4 py-3 text-right">{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#0B1A2D]">{user.displayName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-4 py-3 font-medium text-slate-600">
                  {user.roleLabel}
                </td>
                <td className="px-4 py-3">
                  <span className={statusBadgeClass(user.status)}>
                    {t(`userStatus.${user.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ReliabilityBar value={user.reliability} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                    aria-label={t("columns.actions")}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
