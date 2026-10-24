"use client";

import { ROLES, type Role } from "@/lib/constants";
import { useRoleStore } from "@/stores/role";
import { useTranslations } from "next-intl";

export function DevRoleSwitcher() {
  const t = useTranslations();
  const { role, setRole } = useRoleStore();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card p-3 shadow-lg rtl:left-4 rtl:right-auto">
      <p className="mb-1 text-xs font-medium text-muted-foreground">
        {t("devSwitcher.label")}
      </p>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="rounded-md border bg-background px-2 py-1 text-sm"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {t(`roles.${r}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
