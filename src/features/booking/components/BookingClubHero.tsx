"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Info, MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Club } from "@/types";

type BookingClubHeroProps = {
  club: Club;
};

export function BookingClubHero({ club }: BookingClubHeroProps) {
  const t = useTranslations("bookingCalendar");

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <div className="relative min-h-[180px] sm:h-52">
        <Image
          src={club.imageUrl}
          alt={club.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/95 via-[#0B1A2D]/55 to-[#0B1A2D]/25 sm:bg-gradient-to-r sm:from-[#0B1A2D]/85 sm:via-[#0B1A2D]/45 sm:to-transparent" />
        <div className="relative z-10 flex min-h-[180px] flex-col justify-end gap-3 p-4 sm:absolute sm:inset-0 sm:min-h-0 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {club.isPremium ? (
                <Badge className="rounded-md border-none bg-[#E8B923] text-[10px] font-bold text-[#0B1A2D] uppercase hover:bg-[#E8B923]">
                  {t("premiumBadge")}
                </Badge>
              ) : null}
              <span className="flex items-center gap-1 text-sm font-bold text-white">
                <Star className="h-3.5 w-3.5 fill-[#C0FF00] text-[#C0FF00]" />
                {club.rating.toFixed(1)}
              </span>
            </div>
            <h2 className="text-xl font-black break-words text-white sm:text-3xl">
              {club.name}
            </h2>
            <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-white/80 sm:text-sm">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C0FF00]" />
              <span>
                {club.location}, {club.city}
              </span>
            </p>
          </div>
          <Button
            asChild
            className="h-11 w-full shrink-0 rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D] hover:bg-[#C0FF00]/90 sm:h-10 sm:w-auto"
          >
            <Link href={`/player/clubs/${club.slug}`}>
              <Info className="h-4 w-4" />
              {t("clubInfo")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
