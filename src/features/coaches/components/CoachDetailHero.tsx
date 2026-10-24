"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CalendarDays, Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authAwareHref } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";
import { type Coach } from "@/types";

type CoachDetailHeroProps = {
  coach: Coach;
};

export function CoachDetailHero({ coach }: CoachDetailHeroProps) {
  const t = useTranslations("coachDetailPage");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const bookHref = authAwareHref(
    `/player/coaches/${coach.slug}/book`,
    isAuthenticated,
  );

  return (
    <section className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[340px] sm:h-[380px]">
      <Image
        src={coach.imageUrl}
        alt={coach.displayName}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/55 to-[#0B1A2D]/20" />

      <div className="relative z-10 flex min-h-[280px] flex-col justify-end gap-4 p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:min-h-0 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="max-w-2xl">
          <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3">
            <Badge className="rounded-md border-none bg-[#C0FF00] px-2.5 py-1 text-[10px] font-bold text-[#0B1A2D] uppercase hover:bg-[#C0FF00]">
              {coach.level}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs font-bold text-white sm:text-sm">
              <Star className="h-3.5 w-3.5 fill-[#C0FF00] text-[#C0FF00] sm:h-4 sm:w-4" />
              {coach.rating.toFixed(1)}{" "}
              <span className="font-medium text-white/70">
                ({t("reviews", { count: coach.reviewCount })})
              </span>
            </span>
          </div>
          <h1 className="mb-2 text-2xl leading-tight font-black tracking-tight text-white sm:mb-3 sm:text-4xl md:text-5xl">
            {coach.displayName}
          </h1>
          <div className="flex flex-col gap-1.5 text-xs font-medium text-white/85 sm:flex-row sm:items-center sm:gap-5 sm:text-sm">
            <span className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C0FF00] sm:h-4 sm:w-4" />
              <span>
                {coach.location}, {coach.city} · {coach.clubName}
              </span>
            </span>
            <span className="flex items-start gap-1.5">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C0FF00] sm:h-4 sm:w-4" />
              <span>
                {t("experience", { years: coach.yearsExperience })} ·{" "}
                {coach.pricePerHour} {t("perHour")}
              </span>
            </span>
          </div>
        </div>

        <Button
          asChild
          className="h-12 w-full shrink-0 rounded-xl bg-[#0B1A2D] px-6 text-sm font-bold text-[#C0FF00] shadow-lg hover:bg-[#0B1A2D]/90 sm:h-14 sm:w-auto sm:px-8"
        >
          <Link href={bookHref}>
            <CalendarDays className="h-5 w-5" />
            {isAuthenticated ? t("bookCta") : t("bookLogin")}
          </Link>
        </Button>
      </div>
    </section>
  );
}
