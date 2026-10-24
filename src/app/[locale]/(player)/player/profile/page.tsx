"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Bell,
  ChevronRight,
  Globe,
  Lock,
  Mail,
  MapPin,
  Moon,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { cn } from "@/lib/utils";
import { useMeAccount, useUpdateProfile } from "@/hooks/useMe";
import { useSessionStore } from "@/stores/session";

type ProfileOverrides = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
};

export default function ProfilePage() {
  const t = useTranslations("profilePage");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("authForms");
  const { data: me, isLoading, isError, refetch } = useMeAccount();
  const updateProfile = useUpdateProfile();
  const setUser = useSessionStore((s) => s.setUser);
  const sessionUser = useSessionStore((s) => s.user);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [overrides, setOverrides] = useState<ProfileOverrides>({});

  const firstName =
    overrides.firstName ?? me?.profile?.firstName ?? me?.firstName ?? "";
  const lastName =
    overrides.lastName ?? me?.profile?.lastName ?? me?.lastName ?? "";
  const phone = overrides.phone ?? me?.profile?.phone ?? "";
  const city = overrides.city ?? me?.profile?.city ?? "";

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    me?.email ||
    sessionUser?.email ||
    "—";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const level = me?.profile?.level ?? null;

  async function handleSave() {
    try {
      const updated = await updateProfile.mutateAsync({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || null,
        city: city || undefined,
      });
      if (sessionUser) {
        setUser({
          ...sessionUser,
          firstName: updated.profile?.firstName ?? updated.firstName ?? firstName,
          lastName: updated.profile?.lastName ?? updated.lastName ?? lastName,
          emailVerified: updated.emailVerified ?? sessionUser.emailVerified,
        });
      }
      setOverrides({});
      toast.success(t("saveProfile"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tAuth("errorGeneric")));
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-sm font-medium text-slate-500">
        {tCommon("loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm font-medium text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#0B1A2D] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      {/* Profile card */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#0B1A2D] to-[#132a45] px-5 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-4 border-white/20 shadow-lg">
              <AvatarImage src="/placeholder-avatar.jpg" alt={displayName} />
              <AvatarFallback className="bg-[#C0FF00] text-lg font-black text-[#0B1A2D]">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="text-xl font-black text-white">{displayName}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {level ? (
                  <Badge className="rounded-md border-none bg-[#C0FF00] text-[10px] font-bold text-[#0B1A2D] hover:bg-[#C0FF00]">
                    {level}
                  </Badge>
                ) : null}
                <span className="text-xs font-medium text-white/70">
                  {me?.email}
                </span>
              </div>
            </div>
            <Button
              type="button"
              className="h-10 w-full rounded-xl bg-white/10 font-semibold text-white hover:bg-white/20 sm:ml-auto sm:w-auto"
            >
              {t("editPhoto")}
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-black text-[#0B1A2D]">
            <User className="h-4 w-4 text-slate-400" />
            {t("personalInfo")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{tAuth("firstName")}</span>
              <div className="relative">
                <User className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                <Input
                  value={firstName}
                  onChange={(e) =>
                    setOverrides((o) => ({ ...o, firstName: e.target.value }))
                  }
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 font-medium"
                />
              </div>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{tAuth("lastName")}</span>
              <Input
                value={lastName}
                onChange={(e) =>
                  setOverrides((o) => ({ ...o, lastName: e.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-slate-50 font-medium"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{t("fields.phone")}</span>
              <div className="relative">
                <Phone className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                <Input
                  value={phone}
                  onChange={(e) =>
                    setOverrides((o) => ({ ...o, phone: e.target.value }))
                  }
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 font-medium"
                />
              </div>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{t("fields.email")}</span>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                <Input
                  value={me?.email ?? ""}
                  readOnly
                  className="h-11 rounded-xl border-slate-200 bg-slate-100 pl-10 font-medium"
                />
              </div>
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold text-slate-500">{t("fields.city")}</span>
              <div className="relative">
                <MapPin className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                <Input
                  value={city}
                  onChange={(e) =>
                    setOverrides((o) => ({ ...o, city: e.target.value }))
                  }
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 font-medium"
                />
              </div>
            </label>
          </div>

          <Button
            type="button"
            disabled={updateProfile.isPending}
            onClick={() => void handleSave()}
            className="mt-2 h-11 w-full rounded-xl bg-[#0B1A2D] font-bold text-white hover:bg-[#0B1A2D]/90 sm:w-auto sm:px-8"
          >
            {t("saveProfile")}
          </Button>
        </div>
      </section>

      {/* Settings / Paramètres */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-[#0B1A2D]">
          <Shield className="h-4 w-4 text-slate-400" />
          {t("settingsTitle")}
        </h3>

        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            title={t("settings.notifications")}
            description={t("settings.notificationsDesc")}
            checked={notifications}
            onChange={setNotifications}
          />
          <ToggleRow
            icon={<Moon className="h-4 w-4" />}
            title={t("settings.darkMode")}
            description={t("settings.darkModeDesc")}
            checked={darkMode}
            onChange={setDarkMode}
          />
          <ActionRow
            icon={<Globe className="h-4 w-4" />}
            title={t("settings.language")}
            value={t("settings.languageValue")}
          />
          <ActionRow
            icon={<Lock className="h-4 w-4" />}
            title={t("settings.password")}
            value={t("settings.passwordAction")}
          />
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs font-medium text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#0B1A2D]" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
            checked && "bg-[#C0FF00]",
          )}
        />
      </button>
    </div>
  );
}

function ActionRow({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs font-medium text-slate-500">{value}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}
