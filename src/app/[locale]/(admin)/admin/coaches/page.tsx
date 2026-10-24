"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateAdminCoach,
  usePatchCoachAssessPermission,
} from "@/hooks/useAdmin";
import { useCoaches } from "@/hooks/useCoaches";

export default function AdminCoachesPage() {
  const t = useTranslations("adminCoachesPage");
  const { data, isLoading, isError, refetch } = useCoaches();
  const createCoach = useCreateAdminCoach();
  const assessPerm = usePatchCoachAssessPermission();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function onCreate() {
    if (!email.trim() || !firstName.trim()) return;
    try {
      await createCoach.mutateAsync({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || "Coach",
      });
      setEmail("");
      setFirstName("");
      setLastName("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function onAllowAssess(coachId: string) {
    try {
      await assessPerm.mutateAsync({ coachId, allowed: true });
      toast.success(t("assessOk"));
    } catch {
      toast.error(t("assessError"));
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-[1000px] animate-pulse space-y-3 p-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-100" />)}</div>;
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">{t("retry")}</Button>
      </div>
    );
  }

  const busy = createCoach.isPending || assessPerm.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle", { count: data?.length ?? 0 })}</p>
      </header>

      <div className="grid gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:grid-cols-4">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} className="h-11" />
        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("firstNamePlaceholder")} className="h-11" />
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("lastNamePlaceholder")} className="h-11" />
        <Button type="button" disabled={busy || !email.trim()} onClick={() => void onCreate()} className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]">
          {t("create")}
        </Button>
      </div>

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {(data ?? []).map((coach) => (
          <li key={coach.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="text-sm font-bold text-[#0B1A2D]">{coach.displayName}</p>
              <p className="text-xs text-slate-500">
                {coach.city} · {coach.level} · {coach.rating.toFixed(1)}★
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0B1A2D]">
                {coach.pricePerHour} TND/h
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void onAllowAssess(coach.id)}
                className="h-8 rounded-lg text-[11px]"
              >
                {t("allowAssess")}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
