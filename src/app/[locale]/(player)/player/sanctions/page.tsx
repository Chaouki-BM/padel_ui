"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { useBehaviour, useCreateAppeal } from "@/hooks/useMe";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return null;
}

export default function SanctionsPage() {
  const t = useTranslations("sanctionsPage");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useBehaviour();
  const appeal = useCreateAppeal();
  const [message, setMessage] = useState("");
  const [sanctionId, setSanctionId] = useState("");

  async function handleAppeal(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await appeal.mutateAsync({
        message: message.trim(),
        sanctionId: sanctionId.trim() || undefined,
      });
      setMessage("");
      setSanctionId("");
      toast.success(t("appealSent"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
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

  const sanctions = data?.sanctions ?? [];
  const infractions = data?.infractions ?? [];
  const appeals = data?.appeals ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#0B1A2D]">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("status", { status: data?.status ?? "—" })}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("sanctions")}</h2>
        {sanctions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("emptySanctions")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sanctions.map((item, i) => {
              const row = asRecord(item);
              const id = String(row?.id ?? i);
              const label = String(
                row?.reason ?? row?.type ?? row?.status ?? JSON.stringify(item),
              );
              return (
                <li
                  key={id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{label}</span>
                  {row?.id ? (
                    <span className="ml-2 text-xs text-slate-400">{String(row.id)}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("infractions")}</h2>
        {infractions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("emptyInfractions")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {infractions.map((item, i) => {
              const row = asRecord(item);
              return (
                <li
                  key={String(row?.id ?? i)}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {String(row?.reason ?? row?.type ?? JSON.stringify(item))}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("appeals")}</h2>
        {appeals.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("emptyAppeals")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {appeals.map((item, i) => {
              const row = asRecord(item);
              return (
                <li
                  key={String(row?.id ?? i)}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {String(row?.message ?? row?.status ?? JSON.stringify(item))}
                </li>
              );
            })}
          </ul>
        )}

        <form className="mt-4 space-y-3" onSubmit={(e) => void handleAppeal(e)}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="sanctionId">
              {t("sanctionIdOptional")}
            </label>
            <Input
              id="sanctionId"
              value={sanctionId}
              onChange={(e) => setSanctionId(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="appealMessage">
              {t("appealMessage")}
            </label>
            <textarea
              id="appealMessage"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={appeal.isPending}
            className="rounded-xl bg-[#0B1A2D] font-semibold text-white"
          >
            {t("submitAppeal")}
          </Button>
        </form>
      </section>
    </div>
  );
}
