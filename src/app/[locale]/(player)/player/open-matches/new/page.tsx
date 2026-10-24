"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClubs } from "@/hooks/useClubs";
import { useCreateOpenMatch } from "@/hooks/useOpenMatches";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { buildStartAt } from "@/lib/booking-time";
import { LEVEL_CODES } from "@/lib/constants";

export default function NewOpenMatchPage() {
  const t = useTranslations("openMatchForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: clubs } = useClubs();
  const create = useCreateOpenMatch();

  const [clubId, setClubId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [type, setType] = useState<"FRIENDLY" | "COMPETITIVE">("FRIENDLY");
  const [levelMin, setLevelMin] = useState("");
  const [levelMax, setLevelMax] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!clubId || !date || !time) {
      toast.error(t("required"));
      return;
    }
    try {
      const match = await create.mutateAsync({
        clubId,
        startAt: buildStartAt(date, time),
        type,
        levelMin: levelMin
          ? (levelMin as (typeof LEVEL_CODES)[number])
          : undefined,
        levelMax: levelMax
          ? (levelMax as (typeof LEVEL_CODES)[number])
          : undefined,
        pricePerPlayer: price ? Number(price) : undefined,
        notes: notes || undefined,
      });
      toast.success(t("success"));
      router.push(`/player/open-matches/${match.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-600">{t("club")}</span>
          <select
            required
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            <option value="">—</option>
            {(clubs ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">{t("date")}</span>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">{t("time")}</span>
            <Input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl"
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-600">{t("type")}</span>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "FRIENDLY" | "COMPETITIVE")
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            <option value="FRIENDLY">{t("friendly")}</option>
            <option value="COMPETITIVE">{t("competitive")}</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">{t("levelMin")}</span>
            <select
              value={levelMin}
              onChange={(e) => setLevelMin(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
            >
              <option value="">—</option>
              {LEVEL_CODES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-slate-600">{t("levelMax")}</span>
            <select
              value={levelMax}
              onChange={(e) => setLevelMax(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
            >
              <option value="">—</option>
              {LEVEL_CODES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-600">{t("price")}</span>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-xl"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-600">{t("notes")}</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </label>

        <Button
          type="submit"
          disabled={create.isPending}
          className="h-12 w-full rounded-xl bg-[#0B1A2D] font-semibold text-white"
        >
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
