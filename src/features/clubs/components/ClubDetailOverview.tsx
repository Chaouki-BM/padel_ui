"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Coffee,
  Dumbbell,
  ParkingSquare,
  ShoppingBag,
  ShowerHead,
  Wifi,
} from "lucide-react";
import { type Club, type ClubAmenity } from "@/types";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: Record<
  ClubAmenity,
  ComponentType<{ className?: string }>
> = {
  wifi: Wifi,
  parking: ParkingSquare,
  cafeteria: Coffee,
  lockers: ShowerHead,
  shop: ShoppingBag,
  racket_rental: Dumbbell,
};

type ClubDetailOverviewProps = {
  club: Club;
  onSeeAllPhotos: () => void;
};

export function ClubDetailOverview({
  club,
  onSeeAllPhotos,
}: ClubDetailOverviewProps) {
  const t = useTranslations("clubDetail");
  const [openFaq, setOpenFaq] = useState<string | null>(
    club.faqs[0]?.id ?? null,
  );

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <section>
        <h2 className="mb-3 text-lg font-black text-[#0B1A2D] sm:mb-4 sm:text-xl">
          {t("about")}
        </h2>
        <div className="space-y-3 text-sm leading-relaxed font-medium whitespace-pre-line text-slate-600">
          {club.description}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black text-[#0B1A2D]">
          {t("amenities")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {club.amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity];
            return (
              <div
                key={amenity}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {t(`amenity.${amenity}`)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0B1A2D]">{t("gallery")}</h2>
          <button
            type="button"
            onClick={onSeeAllPhotos}
            className="text-sm font-bold text-slate-500 hover:text-[#0B1A2D]"
          >
            {t("seeAll")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {club.gallery.slice(0, 4).map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt={`${club.name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black text-[#0B1A2D]">{t("faq")}</h2>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white">
          {club.faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen ? (
                  <p className="px-5 pb-4 text-sm leading-relaxed font-medium text-slate-500">
                    {faq.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
