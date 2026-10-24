"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { formatTunisDate } from "@/lib/format";
import { eventTypeLabel } from "@/services/events";
import { useEvents } from "@/hooks/useEvents";

export default function PlayerEventsPage() {
  const t = useTranslations("eventsPublicPage");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useEvents();
  const events = data ?? [];

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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      {events.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500">{t("empty")}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/player/events/${event.slug}`}
                className="block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {eventTypeLabel(event.type)}
                </p>
                <h2 className="mt-1 font-black text-[#0B1A2D]">{event.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{event.clubName}</p>
                {event.startAt ? (
                  <p className="mt-1 text-xs text-slate-400">
                    {formatTunisDate(event.startAt)}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
