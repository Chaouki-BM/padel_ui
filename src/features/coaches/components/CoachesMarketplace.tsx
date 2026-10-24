"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, MapPin, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CoachCard } from "@/features/coaches/components/CoachCard";
import { useCoaches } from "@/hooks/useCoaches";
import { cn } from "@/lib/utils";

const CITIES = ["all", "Tunis", "Sousse", "Monastir"] as const;

export function CoachesMarketplace() {
  const t = useTranslations("coachesMarketplace");
  const { data: coaches, isLoading, isError, refetch } = useCoaches();
  const [city, setCity] = useState<(typeof CITIES)[number]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
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

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-[#0B1A2D] sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm font-medium text-slate-500">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 rounded-full border-none bg-[#f1f5f9] pr-4 pl-10 shadow-sm focus-visible:ring-1 focus-visible:ring-[#0B1A2D]"
          />
        </div>

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
              {c === "all" ? t("filters.allCities") : c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <MapPin className="h-4 w-4 text-[#C0FF00]" />
        {t("results", { count: filtered.length })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[380px] animate-pulse rounded-[24px] bg-slate-100"
            />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-slate-100 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-500">{t("error")}</p>
          <Button
            onClick={() => void refetch()}
            className="rounded-full bg-[#0B1A2D] px-6 font-semibold text-white hover:bg-[#0B1A2D]/90"
          >
            {t("retry")}
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white py-16 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">{t("empty")}</p>
        </div>
      ) : null}

      {!isLoading && !isError && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
