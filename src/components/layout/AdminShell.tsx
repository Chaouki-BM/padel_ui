"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  AlertTriangle,
  Bell,
  Building2,
  CircleDollarSign,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Percent,
  Search,
  Settings,
  ShieldAlert,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/services/auth";

const MAIN_NAV = [
  { href: "/admin/overview", icon: LayoutDashboard, labelKey: "overview" as const },
  { href: "/admin/users", icon: Users, labelKey: "users" as const },
  { href: "/admin/clubs", icon: Building2, labelKey: "clubs" as const },
  { href: "/admin/coaches", icon: GraduationCap, labelKey: "coaches" as const },
  { href: "/admin/finance", icon: CircleDollarSign, labelKey: "finance" as const },
  { href: "/admin/payments", icon: Wallet, labelKey: "payments" as const },
  { href: "/admin/sponsors", icon: Megaphone, labelKey: "sponsors" as const },
  { href: "/admin/events", icon: Trophy, labelKey: "events" as const },
  { href: "/admin/ads", icon: Megaphone, labelKey: "ads" as const },
  { href: "/admin/promotions", icon: Percent, labelKey: "promotions" as const },
  { href: "/admin/complaints", icon: AlertTriangle, labelKey: "complaints" as const },
  { href: "/admin/federation", icon: ShieldAlert, labelKey: "federation" as const },
  { href: "/admin/settings", icon: Settings, labelKey: "settings" as const },
] as const;

const PRIMARY_MOBILE = MAIN_NAV.slice(0, 4);

export function AdminShell({ children }: { children: ReactNode }) {
  const t = useTranslations("adminNav");
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = MAIN_NAV.slice(4).some((item) =>
    pathname.startsWith(item.href),
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 z-50 hidden w-[260px] flex-col bg-[#0B1A2D] text-white xl:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <Trophy className="h-8 w-8 text-[#C0FF00]" />
          <div>
            <p className="text-sm font-black">PadelTunisie</p>
            <p className="text-[10px] font-medium text-slate-400">Admin Console</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="mb-3 px-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {t("menu")}
          </div>
          <nav className="space-y-0.5 px-3">
            {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#C0FF00]/10 text-[#C0FF00]"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-[#C0FF00]" />
            {t("secure")}
          </div>
          <button
            type="button"
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-col xl:pl-[260px]">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-slate-100 bg-white/95 px-3 backdrop-blur-md sm:h-16 sm:gap-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 xl:hidden">
            <Trophy className="h-6 w-6 text-[#0B1A2D]" />
            <span className="text-xs font-black text-[#0B1A2D]">Admin</span>
          </div>
          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="h-10 rounded-full border-none bg-slate-100 pl-10 text-sm sm:h-11"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 sm:h-10 sm:w-10"
              aria-label={t("notifications")}
            >
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                alt="Admin"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] xl:pb-8">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] xl:hidden">
          <div className="grid grid-cols-5 gap-0.5 px-1 py-1.5">
            {PRIMARY_MOBILE.map(({ href, icon: Icon, labelKey }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[9px] font-bold",
                    isActive ? "text-[#0B1A2D]" : "text-slate-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="max-w-full truncate">{t(labelKey)}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[9px] font-bold",
                moreActive || moreOpen ? "text-[#0B1A2D]" : "text-slate-400",
              )}
            >
              <Menu className="h-4 w-4" />
              <span>{t("more")}</span>
            </button>
          </div>
        </nav>

        {moreOpen ? (
          <div className="fixed inset-0 z-50 xl:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label={t("close")}
              onClick={() => setMoreOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-black text-[#0B1A2D]">{t("moreTitle")}</h2>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
                  aria-label={t("close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
                {MAIN_NAV.map(({ href, icon: Icon, labelKey }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold",
                        isActive
                          ? "border-[#C0FF00] bg-[#F3FFCC] text-[#0B1A2D]"
                          : "border-slate-100 bg-slate-50 text-slate-600",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{t(labelKey)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
