"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { formatTunisDate } from "@/lib/format";
import { eventTypeLabel } from "@/services/events";
import { useEventDetail } from "@/hooks/useEvents";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function EventDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("eventDetailPage");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useEventDetail(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-500">
        {tCommon("loading")}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 px-4 py-10">
        <p className="text-sm text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  const { event, extras } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {eventTypeLabel(event.type)}
        </p>
        <h1 className="mt-1 text-3xl font-black text-[#0B1A2D]">{event.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {event.clubName}
          {event.city ? ` · ${event.city}` : ""}
        </p>
        {event.startAt ? (
          <p className="mt-1 text-sm text-slate-500">
            {formatTunisDate(event.startAt)}
          </p>
        ) : null}
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("participants")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {Array.isArray(extras.participants)
            ? t("participantsCount", { count: extras.participants.length })
            : t("participantsCount", { count: 0 })}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("standings")}</h2>
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {extras.standings
            ? JSON.stringify(extras.standings, null, 2)
            : t("noStandings")}
        </pre>
      </section>

      {extras.bracket ? (
        <section className="rounded-2xl border border-slate-100 bg-white p-5">
          <h2 className="text-sm font-black text-[#0B1A2D]">{t("bracket")}</h2>
          <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            {JSON.stringify(extras.bracket, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
