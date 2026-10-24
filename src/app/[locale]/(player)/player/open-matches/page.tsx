"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { OpenMatchCard } from "@/features/open-matches/components/OpenMatchCard";
import { useOpenMatches } from "@/hooks/useOpenMatches";
import { Link } from "@/i18n/navigation";
import { authAwareHref } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";
import {
  Plus,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  ChevronRight,
  Users,
  Inbox,
} from "lucide-react";

export default function OpenMatchesPage() {
  const t = useTranslations("openMatchesPage");
  const tCommon = useTranslations("common");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const createHref = authAwareHref("/player/open-matches/new", isAuthenticated);
  const { data, isLoading, isError, refetch } = useOpenMatches();
  const matches = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-[#001f3f] sm:text-3xl dark:text-white">
              {t("title")}
            </h1>
            <span className="rounded-full bg-[#C0FF00] px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-[#0B2341] uppercase">
              {t("liveBadge")}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-gray-200 px-5 text-sm font-semibold text-[#0B2341]"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t("filters")}
          </Button>
          <Button
            asChild
            className="h-10 rounded-xl bg-[#0B2341] px-5 text-sm font-semibold text-white"
          >
            <Link href={createHref}>
              <Plus className="mr-2 h-4 w-4" />
              {isAuthenticated ? t("createMatch") : t("createMatchLogin")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl bg-[#0B2341] px-5 py-4 text-white">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#C0FF00] uppercase">
              {t("statsAvailable")}
            </div>
            <div className="mt-1 text-2xl font-black">
              {t("statsParties", { count: matches.length })}
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Users className="h-5 w-5 text-[#C0FF00]" />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white px-5 py-4">
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {t("filterLevel")}
          </div>
          <button
            type="button"
            className="mt-1 flex items-center justify-between text-sm font-semibold text-[#0B2341]"
          >
            {t("filterLevelAll")}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white px-5 py-4">
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {t("filterLocation")}
          </div>
          <div className="mt-1 flex items-center text-sm font-semibold text-[#0B2341]">
            <MapPin className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
            {t("filterLocationPlaceholder")}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-0.5 w-6 bg-[#0B2341]" />
        <h2 className="text-sm font-black tracking-wide text-[#0B2341] uppercase">
          {t("sectionTitle")}
        </h2>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-slate-500">
          {tCommon("loading")}
        </p>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-red-600">{tCommon("error")}</p>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            {tCommon("errorRetry")}
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Inbox className="h-7 w-7 text-gray-400" />
          </div>
          <p className="mt-4 text-sm text-gray-500">{t("empty")}</p>
        </div>
      ) : null}

      {!isLoading && !isError && matches.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {matches.map((match) => (
              <OpenMatchCard key={match.id} match={match} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-[#0B2341]"
            >
              {t("loadMore")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
