"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRankings } from "@/hooks/useRankings";

export default function RankingPage() {
  const t = useTranslations("rankingPage");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useRankings({ take: 50 });

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

  const rows = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#0B1A2D]">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <ol className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-4 border-b border-slate-50 px-4 py-3 last:border-0"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B1A2D] text-xs font-black text-[#C0FF00]">
                {row.position}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#0B1A2D]">
                  {row.displayName}
                </p>
                <p className="text-xs text-slate-500">
                  {row.city || "—"} · {row.level}
                </p>
              </div>
              <span className="text-sm font-black text-slate-800">
                {Math.round(row.rating)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
