"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { useClubs } from "@/hooks/useClubs";

type PageProps = {
  params: Promise<{ city: string }>;
};

export default function ClubsByCityPage({ params }: PageProps) {
  const { city: cityParam } = use(params);
  const city = decodeURIComponent(cityParam);
  const t = useTranslations("pages.public");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useClubs({ city });
  const clubs = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-black text-[#0B1A2D] sm:text-3xl">
        {t("clubs", { city })}
      </h1>
      {isLoading ? (
        <p className="text-sm text-slate-500">{tCommon("loading")}</p>
      ) : null}
      {isError ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-red-600">{tCommon("error")}</p>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            {tCommon("errorRetry")}
          </Button>
        </div>
      ) : null}
      {!isLoading && !isError && clubs.length === 0 ? (
        <p className="text-sm text-slate-500">{tCommon("notFound")}</p>
      ) : null}
      {!isLoading && !isError && clubs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
