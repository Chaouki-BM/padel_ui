"use client";

import { use, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpenMatchCard } from "@/features/open-matches/components/OpenMatchCard";
import {
  useCancelOpenMatch,
  useJoinOpenMatch,
  useLeaveOpenMatch,
  useOpenMatch,
  usePayOpenMatch,
  useSubmitOpenMatchResult,
} from "@/hooks/useOpenMatches";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { loginPath } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function OpenMatchDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations("openMatchDetailPage");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, refetch } = useOpenMatch(id);
  const join = useJoinOpenMatch();
  const leave = useLeaveOpenMatch();
  const pay = usePayOpenMatch();
  const cancel = useCancelOpenMatch();
  const submitResult = useSubmitOpenMatchResult();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const [scoreA, setScoreA] = useState("6");
  const [scoreB, setScoreB] = useState("4");

  async function handleJoin() {
    try {
      await join.mutateAsync(id);
      toast.success(t("joined"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleLeave() {
    try {
      await leave.mutateAsync(id);
      toast.success(t("left"));
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handlePay() {
    try {
      const result = await pay.mutateAsync(id);
      if (result.paymentId) {
        router.push(`/player/pay/${result.paymentId}`);
        return;
      }
      toast.success(t("paid"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleCancel() {
    try {
      await cancel.mutateAsync(id);
      toast.success(t("cancelled"));
      router.push("/player/open-matches");
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

  async function handleResult(e: FormEvent) {
    e.preventDefault();
    if (!p1 || !p2 || !p3 || !p4) {
      toast.error(t("resultPlayersRequired"));
      return;
    }
    try {
      await submitResult.mutateAsync({
        id,
        body: {
          teamA: [p1, p2],
          teamB: [p3, p4],
          scoreA: Number(scoreA),
          scoreB: Number(scoreB),
          kind: "OFFICIAL",
        },
      });
      toast.success(t("resultSent"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, tCommon("error")));
    }
  }

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

  const players = data.players;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-black text-[#0B1A2D]">{t("title")}</h1>
      <OpenMatchCard match={data} />

      <div className="flex flex-wrap gap-2">
        {isAuthenticated ? (
          <Button
            type="button"
            disabled={join.isPending}
            onClick={() => void handleJoin()}
            className="rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D]"
          >
            {t("join")}
          </Button>
        ) : (
          <Button
            asChild
            className="rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D]"
          >
            <Link href={loginPath(pathname)}>{t("joinLogin")}</Link>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={!isAuthenticated || leave.isPending}
          onClick={() => void handleLeave()}
          className="rounded-xl"
        >
          {t("leave")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!isAuthenticated || pay.isPending}
          onClick={() => void handlePay()}
          className="rounded-xl"
        >
          {t("pay")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!isAuthenticated || cancel.isPending}
          onClick={() => void handleCancel()}
          className="rounded-xl border-red-200 text-red-600"
        >
          {t("cancel")}
        </Button>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-black text-[#0B1A2D]">{t("resultTitle")}</h2>
        <p className="mt-1 text-xs text-slate-500">{t("resultHint")}</p>
        {players.length > 0 ? (
          <p className="mt-2 text-xs text-slate-400">
            IDs: {players.map((p) => `${p.displayName}=${p.id}`).join(" · ")}
          </p>
        ) : null}
        <form className="mt-4 space-y-3" onSubmit={(e) => void handleResult(e)}>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder={t("teamA1")}
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder={t("teamA2")}
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder={t("teamB1")}
              value={p3}
              onChange={(e) => setP3(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder={t("teamB2")}
              value={p4}
              onChange={(e) => setP4(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              className="rounded-xl"
            />
            <Input
              type="number"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={submitResult.isPending}
            className="rounded-xl bg-[#0B1A2D] font-semibold text-white"
          >
            {t("submitResult")}
          </Button>
        </form>
      </section>
    </div>
  );
}
