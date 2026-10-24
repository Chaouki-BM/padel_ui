"use client";

import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  Globe,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Club } from "@/types";

type ClubDetailSidebarProps = {
  club: Club;
};

export function ClubDetailSidebar({ club }: ClubDetailSidebarProps) {
  const t = useTranslations("clubDetail");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.address)}`;

  return (
    <aside className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex h-36 items-center justify-center bg-slate-100">
          <MapPin className="h-10 w-10 text-[#0B1A2D]/40" />
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B1A2D] shadow-lg">
            <MapPin className="h-5 w-5 text-[#C0FF00]" />
          </div>
        </div>
        <div className="space-y-3 p-5">
          <h3 className="text-sm font-black text-[#0B1A2D]">{t("location")}</h3>
          <p className="text-sm font-medium text-slate-500">{club.address}</p>
          <Button
            asChild
            className="w-full rounded-xl bg-[#0B1A2D] font-bold text-white hover:bg-[#0B1A2D]/90"
          >
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              {t("getDirections")}
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-black text-[#0B1A2D]">
          {t("openingHours")}
        </h3>
        <ul className="space-y-2.5">
          {club.openingHours.map((row) => (
            <li
              key={row.day}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium text-slate-500">{row.day}</span>
              <span className="font-bold text-slate-900">{row.hours}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-black text-[#0B1A2D]">{t("contact")}</h3>
        <div className="space-y-3 text-sm font-medium text-slate-600">
          <a
            href={`tel:${club.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 hover:text-[#0B1A2D]"
          >
            <Phone className="h-4 w-4 text-slate-400" />
            {club.phone}
          </a>
          <a
            href={`https://${club.website.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#0B1A2D]"
          >
            <Globe className="h-4 w-4 text-slate-400" />
            {club.website}
          </a>
          <div className="flex items-center gap-2 pt-1">
            {club.facebookUrl ? (
              <a
                href={club.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600 hover:bg-slate-200"
                aria-label="Facebook"
              >
                f
              </a>
            ) : null}
            {club.instagramUrl ? (
              <a
                href={club.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-200"
                aria-label="Instagram"
              >
                IG
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <div className="mb-2 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-[#0B1A2D]" />
          <h3 className="text-sm font-black text-[#0B1A2D]">
            {t("partnerTitle")}
          </h3>
        </div>
        <p className="text-xs leading-relaxed font-medium text-slate-500">
          {t("partnerDesc")}
        </p>
      </div>
    </aside>
  );
}
