"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useClub } from "@/hooks/useClub";
import { loginPath } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function PublicClubPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("publicClubPage");
  const tCommon = useTranslations("common");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data: club, isLoading, isError, refetch } = useClub(slug);
  const playerHref = `/player/book/${slug}`;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-500">
        {tCommon("loading")}
      </div>
    );
  }

  if (isError || !club) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 px-4 py-10">
        <p className="text-sm text-red-600">{tCommon("error")}</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          {tCommon("errorRetry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-black text-[#0B1A2D]">{club.name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {club.city} · {club.courtsCount} {t("courts")}
        </p>
        {club.description ? (
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {club.description}
          </p>
        ) : null}
      </header>
      <Button
        asChild
        className="rounded-xl bg-[#0B1A2D] font-semibold text-white"
      >
        <Link href={isAuthenticated ? playerHref : loginPath(playerHref)}>
          {t("viewFull")}
        </Link>
      </Button>
    </div>
  );
}
