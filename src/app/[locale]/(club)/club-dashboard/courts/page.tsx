"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useBlockedSlots,
  useClubCourts,
  useCreateBlockedSlot,
  useCreateCourt,
  useDeleteBlockedSlot,
  usePutCourtPriceRules,
  usePutCourtSchedules,
  useUpdateCourt,
} from "@/hooks/useClubDashboard";
import { cn } from "@/lib/utils";

function CourtExtras({ courtId }: { courtId: string }) {
  const t = useTranslations("clubCourtsPage");
  const blocked = useBlockedSlots(courtId);
  const createBlocked = useCreateBlockedSlot();
  const deleteBlocked = useDeleteBlockedSlot();
  const putPrices = usePutCourtPriceRules();
  const [price, setPrice] = useState("80");
  const [reason, setReason] = useState("");

  async function onSavePrices() {
    const value = Number(price);
    if (!Number.isFinite(value) || value <= 0) return;
    try {
      await putPrices.mutateAsync({
        courtId,
        rules: [
          { weekday: 1, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 2, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 3, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 4, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 5, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 6, fromMin: 8 * 60, toMin: 22 * 60, price: value },
          { weekday: 7, fromMin: 8 * 60, toMin: 22 * 60, price: value },
        ],
      });
      toast.success(t("priceOk"));
    } catch {
      toast.error(t("priceError"));
    }
  }

  async function onBlock() {
    const startsAt = new Date().toISOString();
    const endsAt = new Date(Date.now() + 3 * 3600_000).toISOString();
    try {
      await createBlocked.mutateAsync({
        courtId,
        startsAt,
        endsAt,
        reason: reason.trim() || "Maintenance",
      });
      setReason("");
      toast.success(t("blockOk"));
    } catch {
      toast.error(t("blockError"));
    }
  }

  return (
    <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
      <div className="flex flex-wrap gap-2">
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="h-8 w-24 text-xs"
          placeholder="TND"
        />
        <Button
          type="button"
          size="sm"
          disabled={putPrices.isPending}
          onClick={() => void onSavePrices()}
          className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
        >
          {t("savePrices")}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("blockReason")}
          className="h-8 flex-1 text-xs"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={createBlocked.isPending}
          onClick={() => void onBlock()}
          className="h-8 rounded-lg text-[11px]"
        >
          {t("addBlock")}
        </Button>
      </div>
      {(blocked.data ?? []).length > 0 ? (
        <ul className="space-y-1">
          {blocked.data!.map((slot) => (
            <li
              key={slot.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px]"
            >
              <span className="text-slate-600">
                {slot.reason} · {slot.overlappingBookings} overlap
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={deleteBlocked.isPending}
                onClick={() =>
                  void deleteBlocked
                    .mutateAsync({ courtId, slotId: slot.id })
                    .then(() => toast.success(t("unblockOk")))
                    .catch(() => toast.error(t("blockError")))
                }
                className="h-7 text-[10px] text-rose-600"
              >
                {t("removeBlock")}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ClubCourtsPage() {
  const t = useTranslations("clubCourtsPage");
  const { data, isLoading, isError, refetch } = useClubCourts();
  const createCourt = useCreateCourt();
  const updateCourt = useUpdateCourt();
  const putSchedules = usePutCourtSchedules();
  const [name, setName] = useState("");
  const [openExtras, setOpenExtras] = useState<string | null>(null);

  async function onCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createCourt.mutateAsync({ name: trimmed, type: "Padel" });
      setName("");
      toast.success(t("createOk"));
    } catch {
      toast.error(t("createError"));
    }
  }

  async function onToggleMaintenance(courtId: string, isMaintenance: boolean) {
    try {
      await updateCourt.mutateAsync({
        courtId,
        body: { active: isMaintenance },
      });
      toast.success(t("updateOk"));
    } catch {
      toast.error(t("updateError"));
    }
  }

  async function onApplySchedule(courtId: string) {
    try {
      await putSchedules.mutateAsync(courtId);
      toast.success(t("scheduleOk"));
    } catch {
      toast.error(t("scheduleError"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] animate-pulse space-y-3 px-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm text-slate-500">{t("error")}</p>
        <Button onClick={() => void refetch()} className="rounded-full bg-[#0B1A2D] text-white">
          {t("retry")}
        </Button>
      </div>
    );
  }

  const courts = data ?? [];
  const busy =
    createCourt.isPending || updateCourt.isPending || putSchedules.isPending;

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-xl font-black text-[#0B1A2D] sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="h-11"
        />
        <Button
          type="button"
          disabled={busy || !name.trim()}
          onClick={() => void onCreate()}
          className="h-11 shrink-0 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
        >
          {t("create")}
        </Button>
      </div>

      {courts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {courts.map((court) => (
            <li
              key={court.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-black text-[#0B1A2D]">{court.name}</h2>
                  <p className="text-xs font-medium text-slate-500">{court.type}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold",
                    court.status === "available" && "bg-emerald-50 text-emerald-700",
                    court.status === "occupied" && "bg-amber-50 text-amber-700",
                    court.status === "maintenance" && "bg-rose-50 text-rose-600",
                  )}
                >
                  {t(`status.${court.status}`)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-[#0B1A2D]">
                  {court.pricePerHour} TND/h
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {t("bookingsToday", { count: court.bookingsToday })}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void onToggleMaintenance(
                      court.id,
                      court.status === "maintenance",
                    )
                  }
                  className="h-8 rounded-lg text-[11px]"
                >
                  {court.status === "maintenance"
                    ? t("activate")
                    : t("maintenance")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={busy}
                  onClick={() => void onApplySchedule(court.id)}
                  className="h-8 rounded-lg bg-[#0B1A2D] text-[11px] text-[#C0FF00]"
                >
                  {t("applySchedule")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setOpenExtras((id) => (id === court.id ? null : court.id))
                  }
                  className="h-8 rounded-lg text-[11px]"
                >
                  {t("more")}
                </Button>
              </div>
              {openExtras === court.id ? <CourtExtras courtId={court.id} /> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
