"use client";

import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/auth";
import { useSessionStore } from "@/stores/session";

export function Header() {
  const t = useTranslations("header");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const displayName = useSessionStore((s) => s.displayName);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1A2D]">
            <Trophy className="h-4 w-4 text-[#C0FF00]" />
          </div>
          <span className="truncate text-sm font-black tracking-tight text-[#0B1A2D] sm:text-base">
            PadelTunisie
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/player/home"
              className="hidden text-xs font-semibold text-slate-600 hover:text-[#0B1A2D] sm:inline sm:text-sm"
            >
              {displayName ?? t("mySpace")}
            </Link>
            <Button
              asChild
              className="h-9 rounded-full bg-[#0B1A2D] px-4 text-xs font-bold text-white hover:bg-[#0B1A2D]/90 sm:h-10 sm:px-5 sm:text-sm"
            >
              <Link href="/player/home">{t("mySpace")}</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void signOut()}
              className="h-9 rounded-full border-slate-200 px-3 text-xs font-bold sm:h-10 sm:px-4 sm:text-sm"
            >
              {t("logout")}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-full border-slate-200 px-3 text-xs font-bold sm:h-10 sm:px-5 sm:text-sm"
            >
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-full bg-[#C0FF00] px-3 text-xs font-bold text-[#0B1A2D] hover:bg-[#C0FF00]/90 sm:h-10 sm:px-5 sm:text-sm"
            >
              <Link href="/register">{t("register")}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
