"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
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
    href: "/coach-space/profile",
    icon: LayoutDashboard,
    labelKey: "dashboard" as const,
  },
  {
    href: "/coach-space/availability",
    icon: CalendarDays,
    labelKey: "availability" as const,
  },
  {
    href: "/coach-space/requests",
    icon: ClipboardList,
    labelKey: "requests" as const,
  },
  {
    href: "/coach-space/clients",
    icon: Users,
    labelKey: "clients" as const,
  },
];

export function CoachShell({ children }: { children: ReactNode }) {
  const t = useTranslations("coachSpaceNav");
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 z-50 hidden w-[260px] flex-col bg-[#0B1A2D] text-white md:flex">
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
          <Link
            href="/player/notifications"
            className="mb-2 flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B1A2D] bg-[#C0FF00]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">
                {t("notifications")}
              </span>
              <span className="text-[10px] text-slate-400">
                {t("newMessages", { count: 3 })}
              </span>
            </div>
          </Link>
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

      <div className="flex min-h-screen w-full flex-col md:pl-[260px]">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:h-20 sm:px-6 lg:px-8">
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
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
                  alt="Coach"
                />
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#0B1A2D]">Sami Ben Ali</p>
                <p className="text-[11px] font-medium text-slate-500">
                  Coach PRO Elite
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden">
          <div className="grid grid-cols-4 gap-1 px-2 py-2">
            {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-bold",
                    isActive ? "text-[#0B1A2D]" : "text-slate-400",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-[#0B1A2D]" : "text-slate-400",
                    )}
                  />
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
