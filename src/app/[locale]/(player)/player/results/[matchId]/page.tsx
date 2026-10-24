"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMyMatches, useRatingHistory, useRespondToMatch } from "@/hooks/useMatches";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { formatTunisDate } from "@/lib/format";

type PageProps = {
  params: Promise<{ matchId: string }>;
};

export default function ResultsPage({ params }: PageProps) {
  const { matchId } = use(params);
  const t = useTranslations("resultsPage");
  const tCommon = useTranslations("common");
  const { data: matches, isLoading, isError, refetch } = useMyMatches();
  const { data: rating } = useRatingHistory();
  const respond = useRespondToMatch();

  const focus = (matches ?? []).find((m) => m.id === matchId);
  const list = matches ?? [];

  async function handleRespond(
    id: string,
    action: "CONFIRM" | "CONTEST",
  ) {
    try {
      await respond.mutateAsync({ id, action });
      toast.success(action === "CONFIRM" ? t("confirmed") : t("contested"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-sm text-slate-500">{tCommon("loading")}</div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <header>
        <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </header>

      {focus ? (
        <section className="rounded-2xl border border-[#C0FF00]/50 bg-[#F3FFCC] p-5">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
            {t("focus")}
          </p>
          <h2 className="mt-1 font-black text-[#0B1A2D]">{focus.label}</h2>
          <p className="text-sm text-slate-600">{focus.dateLabel}</p>
          <p className="mt-1 text-sm">
            {focus.scoreA ?? "—"} – {focus.scoreB ?? "—"} · {focus.status}
          </p>
          {focus.awaitingMyAnswer ? (
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                disabled={respond.isPending}
                onClick={() => void handleRespond(focus.id, "CONFIRM")}
                className="rounded-xl bg-[#0B1A2D] text-white"
              >
                {t("confirm")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={respond.isPending}
                onClick={() => void handleRespond(focus.id, "CONTEST")}
                className="rounded-xl border-red-200 text-red-600"
              >
                {t("contest")}
              </Button>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("myMatches")}</h2>
        {list.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("empty")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-50">
            {list.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-[#0B1A2D]">{m.label}</p>
                  <p className="text-xs text-slate-500">
                    {m.dateLabel} · {m.status}
                    {m.awaitingMyAnswer ? ` · ${t("awaiting")}` : ""}
                  </p>
                </div>
                {m.awaitingMyAnswer ? (
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      disabled={respond.isPending}
                      onClick={() => void handleRespond(m.id, "CONFIRM")}
                      className="rounded-lg bg-[#C0FF00] text-[#0B1A2D]"
                    >
                      OK
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={respond.isPending}
                      onClick={() => void handleRespond(m.id, "CONTEST")}
                      className="rounded-lg"
                    >
                      !
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm font-bold">
                    {m.scoreA ?? "—"}-{m.scoreB ?? "—"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("ratingHistory")}</h2>
        {(rating ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{t("noRating")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(rating ?? []).map((r) => (
              <li
                key={r.id}
                className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
              >
                <span>
                  {r.reason}
                  {r.createdAt ? (
                    <span className="ml-2 text-xs text-slate-400">
                      {formatTunisDate(r.createdAt)}
                    </span>
                  ) : null}
                </span>
                <span className="font-bold">
                  {r.delta > 0 ? `+${r.delta}` : r.delta} → {r.rating}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
