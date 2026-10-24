"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Bell,
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Percent,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/services/auth";

const MAIN_NAV = [
  {
    href: "/club-dashboard/overview",
    icon: LayoutDashboard,
    labelKey: "overview" as const,
  },
  {
    href: "/club-dashboard/courts",
    icon: Building2,
    labelKey: "courts" as const,
  },
  {
    href: "/club-dashboard/calendar",
    icon: CalendarDays,
    labelKey: "calendar" as const,
  },
  {
    href: "/club-dashboard/events",
    icon: Trophy,
    labelKey: "events" as const,
  },
  {
    href: "/club-dashboard/players",
    icon: Users,
    labelKey: "players" as const,
  },
  {
    href: "/club-dashboard/offers",
    icon: Percent,
    labelKey: "offers" as const,
  },
] as const;

export function ClubShell({ children }: { children: ReactNode }) {
  const t = useTranslations("clubDashNav");
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 z-50 hidden w-[260px] flex-col bg-[#0B1A2D] text-white lg:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <Trophy className="h-8 w-8 text-[#C0FF00]" />
          <span className="text-sm font-black tracking-tight">PadelTunisie</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="mb-4 px-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {t("menu")}
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
                      ? "bg-[#C0FF00]/10 text-[#C0FF00]"
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
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {t("logout")}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:h-20 sm:px-6">
          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="h-11 rounded-full border-none bg-slate-100 pl-10 text-sm font-medium"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              aria-label={t("notifications")}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                  alt="Manager"
                />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#0B1A2D]">
                  Club Manager
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  Padel Elite
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] lg:hidden">
          <div className="grid grid-cols-3 gap-1 px-1 py-2 sm:grid-cols-6">
            {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[9px] font-bold sm:text-[10px]",
                    isActive ? "text-[#0B1A2D]" : "text-slate-400",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">{t(labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
