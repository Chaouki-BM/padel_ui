"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  labelKey: string;
};

type DashboardShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  titleKey: string;
};

export function DashboardShell({
  children,
  navItems,
  titleKey,
}: DashboardShellProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r bg-card p-4 md:block rtl:border-l rtl:border-r-0">
        <h2 className="mb-4 text-lg font-semibold">{t(titleKey)}</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, labelKey }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
