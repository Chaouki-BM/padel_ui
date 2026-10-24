"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Star, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loginPath } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";
import { type Club } from "@/types";

type ClubCardProps = {
  club: Club;
};

export function ClubCard({ club }: ClubCardProps) {
  const t = useTranslations("clubsMarketplace");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const viewHref = `/club/${club.slug}`;
  const reserveTarget = `/player/book/${club.slug}`;
  const bookHref = isAuthenticated ? reserveTarget : loginPath(reserveTarget);

  return (
    <article className="flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={viewHref} className="relative block h-48 w-full shrink-0">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {club.availableNow ? (
          <Badge className="absolute left-3.5 top-3.5 rounded-full border-none bg-[#C0FF00] px-3 py-1 text-[11px] font-bold text-[#0B1A2D] shadow-sm hover:bg-[#C0FF00]">
            {t("card.available")}
          </Badge>
        ) : (
          <Badge className="absolute left-3.5 top-3.5 rounded-full border-none bg-slate-900/70 px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-slate-900/70">
            {t("card.busy")}
          </Badge>
        )}
        <div className="absolute right-3.5 bottom-3.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-[#C0FF00] text-[#C0FF00]" />
          {club.rating.toFixed(1)}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={viewHref}>
          <h3 className="mb-1 text-[17px] font-bold text-slate-900 hover:underline">
            {club.name}
          </h3>
        </Link>
        <div className="mb-4 flex items-center text-[13px] font-medium text-slate-500">
          <MapPin className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          {club.location}, {club.city}
        </div>

        <div className="mb-5 flex items-center justify-between text-[13px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
            {t("card.courts", { count: club.courtsCount })}
          </span>
          <span className="text-[15px] font-black text-[#0B1A2D]">
            {t("card.from")} {club.priceFrom}{" "}
            <span className="text-xs font-bold text-slate-400">
              {t("card.currency")}
            </span>
          </span>
        </div>

        <Button
          asChild
          className="mt-auto w-full rounded-full bg-[#0B1A2D] py-5 text-sm font-semibold text-white hover:bg-[#0B1A2D]/90"
        >
          <Link href={bookHref}>
            {isAuthenticated ? t("card.book") : t("card.bookLogin")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
