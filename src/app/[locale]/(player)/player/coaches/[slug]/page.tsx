"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Award, Images, Info, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachDetailHero } from "@/features/coaches/components/CoachDetailHero";
import { CoachDetailSidebar } from "@/features/coaches/components/CoachDetailSidebar";
import { useCoach } from "@/hooks/useCoaches";
import { cn } from "@/lib/utils";

type TabId = "overview" | "specialties" | "photos" | "reviews";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function CoachDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("coachDetailPage");
  const { data: coach, isLoading, isError, refetch } = useCoach(slug);
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string; icon: typeof Info }[] = [
    { id: "overview", label: t("tabs.overview"), icon: Info },
    { id: "specialties", label: t("tabs.specialties"), icon: Award },
    { id: "photos", label: t("tabs.photos"), icon: Images },
    { id: "reviews", label: t("tabs.reviews"), icon: MessageSquareText },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[320px] bg-slate-200 sm:h-[380px]" />
        <div className="mx-auto max-w-[1200px] space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-10 w-80 rounded-full bg-slate-100" />
          <div className="h-40 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (isError || !coach) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm font-medium text-slate-500">{t("error")}</p>
        <Button
          onClick={() => void refetch()}
          className="rounded-full bg-[#0B1A2D] px-6 font-semibold text-white hover:bg-[#0B1A2D]/90"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-6 md:pb-12">
      <CoachDetailHero coach={coach} />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-slate-200 bg-[#f8fafc]/95 px-4 backdrop-blur-md sm:mx-0 sm:mb-8 sm:px-0 md:top-20">
          <nav className="-mx-1 flex gap-0.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex min-h-11 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors sm:gap-2 sm:px-4 sm:py-3 sm:text-sm",
                  tab === id
                    ? "border-[#0B1A2D] text-[#0B1A2D]"
                    : "border-transparent text-slate-400 hover:text-slate-700",
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">
            {tab === "overview" ? (
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-3 text-lg font-black text-[#0B1A2D]">
                    {t("about")}
                  </h2>
                  <p className="text-sm leading-relaxed font-medium text-slate-600">
                    {coach.bio}
                  </p>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-3 text-lg font-black text-[#0B1A2D]">
                    {t("specialtiesTitle")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}

            {tab === "specialties" ? (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-3 text-lg font-black text-[#0B1A2D]">
                  {t("specialtiesTitle")}
                </h2>
                <p className="mb-4 text-sm font-medium text-slate-500">
                  {t("specialtiesDesc")}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {coach.specialties.map((spec) => (
                    <li
                      key={spec}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-[#0B1A2D]"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {tab === "photos" ? (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-black text-[#0B1A2D]">
                  {t("gallery")}
                </h2>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image
                    src={coach.imageUrl}
                    alt={coach.displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              </section>
            ) : null}

            {tab === "reviews" ? (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-2 text-lg font-black text-[#0B1A2D]">
                  {t("tabs.reviews")}
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  {t("reviewsPlaceholder", { count: coach.reviewCount })}
                </p>
              </section>
            ) : null}
          </div>

          <div className="lg:col-span-4">
            <CoachDetailSidebar coach={coach} />
          </div>
        </div>
      </div>
    </div>
  );
}
