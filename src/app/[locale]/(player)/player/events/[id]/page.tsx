"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { loginPath } from "@/lib/auth";
import { formatTunisDate } from "@/lib/format";
import { eventTypeLabel } from "@/services/events";
import { useSessionStore } from "@/stores/session";
import {
  useCreateEventTeam,
  useEventDetail,
  useRegisterForEvent,
  useWithdrawFromEvent,
} from "@/hooks/useEvents";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Route param is the event slug (shareable URL). */
export default function PlayerEventDetailPage({ params }: PageProps) {
  const { id: slug } = use(params);
  const t = useTranslations("eventDetailPage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, refetch } = useEventDetail(slug);
  const register = useRegisterForEvent();
  const withdraw = useWithdrawFromEvent();
  const createTeam = useCreateEventTeam();
  const [partnerId, setPartnerId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [payMode, setPayMode] = useState<"ON_SITE" | "CARD">("ON_SITE");

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-sm text-slate-500">{tCommon("loading")}</div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 py-8">
        <p className="text-sm text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  const { event, extras } = data;

  async function handleRegister() {
    try {
      const result = await register.mutateAsync({
        slug,
        paymentMode: payMode,
      });
      if (result.paymentId) {
        router.push(`/player/pay/${result.paymentId}`);
        return;
      }
      toast.success(
        result.status === "WAITLISTED" ? t("waitlisted") : t("registered"),
      );
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw.mutateAsync(slug);
      toast.success(t("withdrawn"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleTeam() {
    if (!partnerId.trim()) {
      toast.error(t("partnerRequired"));
      return;
    }
    try {
      await createTeam.mutateAsync({
        slug,
        partnerId: partnerId.trim(),
        name: teamName || undefined,
      });
      toast.success(t("teamCreated"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <header>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {eventTypeLabel(event.type)}
        </p>
        <h1 className="mt-1 text-2xl font-black text-[#0B1A2D]">{event.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{event.clubName}</p>
        {event.startAt ? (
          <p className="mt-1 text-sm text-slate-500">
            {formatTunisDate(event.startAt)}
          </p>
        ) : null}
      </header>

      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("registration")}</h2>
        <select
          value={payMode}
          onChange={(e) => setPayMode(e.target.value as "ON_SITE" | "CARD")}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
        >
          <option value="ON_SITE">{t("payOnSite")}</option>
          <option value="CARD">{t("payCard")}</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {isAuthenticated ? (
            <Button
              type="button"
              disabled={register.isPending}
              onClick={() => void handleRegister()}
              className="rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D]"
            >
              {t("register")}
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D]"
            >
              <Link href={loginPath(pathname)}>{t("registerLogin")}</Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={!isAuthenticated || withdraw.isPending}
            onClick={() => void handleWithdraw()}
            className="rounded-xl"
          >
            {t("withdraw")}
          </Button>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("team")}</h2>
        <Input
          placeholder={t("partnerId")}
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="rounded-xl"
        />
        <Input
          placeholder={t("teamName")}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="rounded-xl"
        />
        <Button
          type="button"
          disabled={!isAuthenticated || createTeam.isPending}
          onClick={() => void handleTeam()}
          className="rounded-xl bg-[#0B1A2D] text-white"
        >
          {t("createTeam")}
        </Button>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("participants")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("participantsCount", {
            count: Array.isArray(extras.participants)
              ? extras.participants.length
              : 0,
          })}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("standings")}</h2>
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs">
          {extras.standings
            ? JSON.stringify(extras.standings, null, 2)
            : t("noStandings")}
        </pre>
      </section>
    </div>
  );
}
