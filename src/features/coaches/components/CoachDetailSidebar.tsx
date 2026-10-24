"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, Globe, MapPin, Phone } from "lucide-react";
import { type Coach } from "@/types";

type CoachDetailSidebarProps = {
  coach: Coach;
};

export function CoachDetailSidebar({ coach }: CoachDetailSidebarProps) {
  const t = useTranslations("coachDetailPage");

  return (
    <aside className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-black text-[#0B1A2D]">{t("location")}</h3>
        <p className="flex items-start gap-2 text-sm font-medium text-slate-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C0FF00]" />
          {coach.clubName}
          <br />
          {coach.location}, {coach.city}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-black text-[#0B1A2D]">{t("contact")}</h3>
        <a
          href={`tel:${coach.phone.replace(/\s/g, "")}`}
          className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1A2D]"
        >
          <Phone className="h-4 w-4 text-slate-400" />
          {coach.phone}
        </a>
        <div className="flex items-start gap-2 text-sm font-medium text-slate-600">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>{coach.languages.join(" · ")}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-black text-[#0B1A2D]">{t("pricing")}</h3>
        <p className="text-2xl font-black text-[#0B1A2D]">
          {coach.pricePerHour}{" "}
          <span className="text-sm font-bold text-slate-400">
            {t("perHour")}
          </span>
        </p>
        <p className="mt-2 text-xs font-medium text-slate-500">
          {t("pricingNote")}
        </p>
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
