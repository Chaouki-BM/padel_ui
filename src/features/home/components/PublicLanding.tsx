"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Search, MapPin, Inbox, Trophy } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { CoachCard } from "@/features/coaches/components/CoachCard";
import { OpenMatchCard } from "@/features/open-matches/components/OpenMatchCard";
import { AdsBannerStrip } from "@/features/ads/components/AdsBannerStrip";
import { useClubs } from "@/hooks/useClubs";
import { useCoaches } from "@/hooks/useCoaches";
import { useOpenMatches } from "@/hooks/useOpenMatches";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/session";

const CITIES = ["all", "Tunis", "Sousse", "Monastir"] as const;

function subscribeHydration(onStoreChange: () => void) {
  return useSessionStore.persist.onFinishHydration(onStoreChange);
}

export function PublicLanding() {
  const t = useTranslations("publicLanding");
  const router = useRouter();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
  const [city, setCity] = useState<(typeof CITIES)[number]>("all");
  const [query, setQuery] = useState("");

  const {
    data: clubs,
    isLoading: clubsLoading,
    isError: clubsError,
    refetch: refetchClubs,
  } = useClubs();
  const {
    data: coaches,
    isLoading: coachesLoading,
    isError: coachesError,
    refetch: refetchCoaches,
  } = useCoaches();
  const {
    data: matchesData,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useOpenMatches();

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      router.replace("/player/home");
    }
  }, [hydrated, isAuthenticated, router]);

  const filteredClubs = useMemo(() => {
    if (!clubs) return [];
    const q = query.trim().toLowerCase();
    return clubs.filter((club) => {
      const cityOk = city === "all" || club.city === city;
      const queryOk =
        q.length === 0 ||
        club.name.toLowerCase().includes(q) ||
        club.location.toLowerCase().includes(q) ||
        club.city.toLowerCase().includes(q);
      return cityOk && queryOk;
    });
  }, [clubs, city, query]);

  const filteredCoaches = useMemo(() => {
    if (!coaches) return [];
    const q = query.trim().toLowerCase();
    return coaches.filter((coach) => {
      const cityOk = city === "all" || coach.city === city;
      const queryOk =
        q.length === 0 ||
        coach.displayName.toLowerCase().includes(q) ||
        coach.location.toLowerCase().includes(q) ||
        coach.city.toLowerCase().includes(q) ||
        coach.specialties.some((s) => s.toLowerCase().includes(q));
      return cityOk && queryOk;
    });
  }, [coaches, city, query]);

  const filteredMatches = useMemo(() => {
    const matches = matchesData?.data ?? [];
    const q = query.trim().toLowerCase();
    return matches.filter((match) => {
      const haystack =
        `${match.clubName} ${match.clubLocation}`.toLowerCase();
      const cityOk = city === "all" || haystack.includes(city.toLowerCase());
      const queryOk = q.length === 0 || haystack.includes(q);
      return cityOk && queryOk;
    });
  }, [matchesData, city, query]);

  if (!hydrated || isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm font-medium text-slate-500">
        …
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-12">
      <section className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[320px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2D]/92 via-[#0B1A2D]/70 to-[#0B1A2D]/40" />
        </div>
        <div className="relative mx-auto flex max-w-[1200px] flex-col justify-end gap-4 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/90 sm:text-sm">
            <Trophy className="h-4 w-4 text-[#C0FF00] sm:h-5 sm:w-5" />
            {t("brand")}
          </div>
          <h1 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-sm font-medium text-white/80 sm:text-base">
            {t("heroSubtitle")}
          </p>
          <div className="relative mt-2 w-full max-w-xl">
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-12 rounded-full border-none bg-white pr-4 pl-11 text-sm shadow-lg focus-visible:ring-2 focus-visible:ring-[#C0FF00]"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={cn(
                "min-h-10 rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm",
                city === c
                  ? "bg-[#0B1A2D] text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:text-slate-900",
              )}
            >
              {c === "all" ? t("allCities") : c}
            </button>
          ))}
        </div>

        <AdsBannerStrip placement="HOME" />

        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#0B1A2D] sm:text-2xl">
                {t("stadiumsTitle")}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {t("stadiumsSubtitle")}
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <MapPin className="h-4 w-4 text-[#C0FF00]" />
              {t("stadiumsResults", { count: filteredClubs.length })}
            </p>
          </header>

          {clubsLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] animate-pulse rounded-[24px] bg-slate-100"
                />
              ))}
            </div>
          ) : null}

          {clubsError ? (
            <div className="flex flex-col items-center gap-3 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <p className="text-sm text-slate-500">{t("clubsError")}</p>
              <Button
                type="button"
                onClick={() => void refetchClubs()}
                className="rounded-full bg-[#0B1A2D] font-semibold text-white"
              >
                {t("retry")}
              </Button>
            </div>
          ) : null}

          {!clubsLoading && !clubsError && filteredClubs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <Inbox className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-500">{t("clubsEmpty")}</p>
            </div>
          ) : null}

          {!clubsLoading && !clubsError && filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#0B1A2D] sm:text-2xl">
                {t("coachesTitle")}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {t("coachesSubtitle")}
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <MapPin className="h-4 w-4 text-[#C0FF00]" />
              {t("coachesResults", { count: filteredCoaches.length })}
            </p>
          </header>

          {coachesLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[380px] animate-pulse rounded-[24px] bg-slate-100"
                />
              ))}
            </div>
          ) : null}

          {coachesError ? (
            <div className="flex flex-col items-center gap-3 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <p className="text-sm text-slate-500">{t("coachesError")}</p>
              <Button
                type="button"
                onClick={() => void refetchCoaches()}
                className="rounded-full bg-[#0B1A2D] font-semibold text-white"
              >
                {t("retry")}
              </Button>
            </div>
          ) : null}

          {!coachesLoading && !coachesError && filteredCoaches.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <Inbox className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-500">{t("coachesEmpty")}</p>
            </div>
          ) : null}

          {!coachesLoading && !coachesError && filteredCoaches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#0B1A2D] sm:text-2xl">
                {t("matchesTitle")}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {t("matchesSubtitle")}
              </p>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <MapPin className="h-4 w-4 text-[#C0FF00]" />
              {t("matchesResults", { count: filteredMatches.length })}
            </p>
          </header>

          {matchesLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-[24px] bg-slate-100"
                />
              ))}
            </div>
          ) : null}

          {matchesError ? (
            <div className="flex flex-col items-center gap-3 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <p className="text-sm text-slate-500">{t("matchesError")}</p>
              <Button
                type="button"
                onClick={() => void refetchMatches()}
                className="rounded-full bg-[#0B1A2D] font-semibold text-white"
              >
                {t("retry")}
              </Button>
            </div>
          ) : null}

          {!matchesLoading && !matchesError && filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-100 bg-white py-12 text-center">
              <Inbox className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-500">{t("matchesEmpty")}</p>
            </div>
          ) : null}

          {!matchesLoading && !matchesError && filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => (
                <OpenMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
