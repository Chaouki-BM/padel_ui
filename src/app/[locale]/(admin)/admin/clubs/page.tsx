"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddClubManager,
  useAdminClubs,
  useCreateAdminClub,
  usePatchAdminClub,
  useRemoveClubManager,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export default function AdminClubsPage() {
  const t = useTranslations("adminClubsPage");
  const { data, isLoading, isError, refetch } = useAdminClubs();
  const createClub = useCreateAdminClub();
  const patchClub = usePatchAdminClub();
  const addManager = useAddClubManager();
  const removeManager = useRemoveClubManager();
  const [name, setName] = useState("");
  const [city, setCity] = useState("Tunis");
  const [managerClubId, setManagerClubId] = useState<string | null>(null);
  const [managerEmail, setManagerEmail] = useState("");

  async function onCreate() {
    if (!name.trim()) return;
    try {
      await createClub.mutateAsync({ name: name.trim(), city: city.trim() || "Tunis" });
      setName("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function onToggle(id: string, active: boolean) {
    try {
      await patchClub.mutateAsync({ id, body: { isActive: active } });
      toast.success(t("updateOk"));
    } catch {
      toast.error(t("updateError"));
    }
  }

  async function onAddManager(clubId: string) {
    if (!managerEmail.trim()) return;
    try {
      await addManager.mutateAsync({
        clubId,
        emailOrUserId: managerEmail.trim(),
      });
      setManagerEmail("");
      setManagerClubId(null);
      toast.success(t("managerOk"));
    } catch {
      toast.error(t("managerError"));
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-[1000px] animate-pulse space-y-3 p-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100" />)}</div>;
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">{t("retry")}</Button>
      </div>
    );
  }

  const busy =
    createClub.isPending ||
    patchClub.isPending ||
    addManager.isPending ||
    removeManager.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} className="h-11" />
        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("cityPlaceholder")} className="h-11 sm:w-40" />
        <Button type="button" disabled={busy || !name.trim()} onClick={() => void onCreate()} className="h-11 rounded-xl bg-[#0B1A2D] text-[#C0FF00]">
          {t("create")}
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {(data ?? []).map((club) => (
          <li key={club.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-black text-[#0B1A2D]">{club.name}</h2>
                <p className="text-xs font-medium text-slate-500">
                  {club.city} · {t("courts", { count: club.courts })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold",
                  club.status === "active" && "bg-emerald-50 text-emerald-700",
                  club.status === "pending" && "bg-amber-50 text-amber-700",
                  club.status === "suspended" && "bg-rose-50 text-rose-600",
                )}>
                  {t(`status.${club.status}`)}
                </span>
                <span className="text-sm font-black text-[#0B1A2D]">
                  {club.revenueMonth.toLocaleString("fr-TN")} TND
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void onToggle(club.id, club.status !== "active")}
                  className="h-8 rounded-lg text-[11px]"
                >
                  {club.status === "active" ? t("suspend") : t("activate")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setManagerClubId((id) => (id === club.id ? null : club.id))
                  }
                  className="h-8 rounded-lg text-[11px]"
                >
                  {t("managers")}
                </Button>
              </div>
            </div>
            {managerClubId === club.id ? (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <Input
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder={t("managerPlaceholder")}
                  className="h-9 flex-1 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={busy || !managerEmail.trim()}
                  onClick={() => void onAddManager(club.id)}
                  className="h-9 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                >
                  {t("addManager")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy || !managerEmail.trim()}
                  onClick={() =>
                    void removeManager
                      .mutateAsync({
                        clubId: club.id,
                        userId: managerEmail.trim(),
                      })
                      .then(() => toast.success(t("managerRemoved")))
                      .catch(() => toast.error(t("managerError")))
                  }
                  className="h-9 rounded-lg text-[11px] text-rose-600"
                >
                  {t("removeManager")}
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
