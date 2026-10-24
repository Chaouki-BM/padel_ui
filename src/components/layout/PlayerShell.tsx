"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Swords,
  User,
  Bell,
  LogOut,
  Search,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/services/auth";
import { useSessionStore } from "@/stores/session";

const MAIN_NAV = [
  { href: "/player/home", icon: LayoutDashboard, labelKey: "home" as const },
  {
    href: "/player/bookings",
    icon: CalendarDays,
    labelKey: "bookings" as const,
  },
  {
    href: "/player/coaches",
    icon: GraduationCap,
    labelKey: "reserveCoach" as const,
  },
  {
    href: "/player/open-matches",
    icon: Swords,
    labelKey: "matches" as const,
  },
  { href: "/player/profile", icon: User, labelKey: "profile" as const },
] as const;

export function PlayerShell({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const router = useRouter();
  const displayName = useSessionStore((s) => s.displayName);
  const user = useSessionStore((s) => s.user);

  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") ||
    displayName?.slice(0, 2).toUpperCase() ||
    "PT";

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 z-50 hidden w-[260px] flex-col bg-[#0B1A2D] text-white md:flex">
        <div className="flex h-20 items-center px-6">
          <Link href="/player/home" className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-[#C0FF00]" />
            <span className="text-sm font-black tracking-tight">PadelTunisie</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="mb-4 px-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {t("menuPrincipal")}
          </div>
          <nav className="space-y-1 px-4">
            {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#C0FF00]"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="truncate">{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 p-4">
          <Link
            href="/player/notifications"
            className="mb-2 flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B1A2D] bg-white" />
            </div>
            <span className="font-semibold text-white">{t("notifications")}</span>
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {tHeader("logout")}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col md:pl-[260px]">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-white/95 px-3 backdrop-blur-md sm:h-16 sm:px-4 md:hidden">
          <Trophy className="h-6 w-6 shrink-0 text-[#0B1A2D]" />
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder={t("searchShort")}
              className="h-9 rounded-full border-none bg-slate-100 py-1 pr-3 pl-8 text-xs"
            />
          </div>
          <Link
            href="/player/notifications"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label={t("notifications")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Link>
        </header>

        <header className="sticky top-0 z-40 hidden h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-full border-none bg-[#f1f5f9] py-2 pr-4 pl-10 shadow-sm focus-visible:ring-1 focus-visible:ring-[#0B1A2D]"
            />
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100"
              asChild
            >
              <Link href="/player/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-white bg-red-500" />
              </Link>
            </Button>
            <div className="flex items-center gap-3 border-l pl-6">
              <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" alt="" />
                <AvatarFallback className="bg-[#0B1A2D] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm leading-none font-bold text-slate-900">
                  {displayName ?? tHeader("mySpace")}
                </span>
                <span className="mt-1 text-[11px] text-slate-500">
                  {user?.role ?? "player"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-around py-1">
            {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex max-w-[4.5rem] flex-col items-center gap-0.5 px-1 py-2 text-[9px] font-medium sm:max-w-none sm:px-2 sm:text-[10px]",
                    isActive
                      ? "text-[#0B1A2D]"
                      : "text-slate-400 hover:text-slate-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "mb-0.5 h-5 w-5",
                      isActive && "text-[#C0FF00]",
                    )}
                  />
                  <span className="truncate text-center">{t(labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
