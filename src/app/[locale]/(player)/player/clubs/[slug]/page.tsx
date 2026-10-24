"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, Images, MessageSquareText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubDetailHero } from "@/features/clubs/components/ClubDetailHero";
import { ClubDetailOverview } from "@/features/clubs/components/ClubDetailOverview";
import { ClubDetailSidebar } from "@/features/clubs/components/ClubDetailSidebar";
import { useClub } from "@/hooks/useClub";
import { useClubReviews } from "@/hooks/useClubs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Star } from "lucide-react";

type TabId = "overview" | "courts" | "photos" | "reviews";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ClubDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("clubDetail");
  const { data: club, isLoading, isError, refetch } = useClub(slug);
  const reviewsQuery = useClubReviews(slug);
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string; icon: typeof Info }[] = [
    { id: "overview", label: t("tabs.overview"), icon: Info },
    { id: "courts", label: t("tabs.courts"), icon: LayoutGrid },
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

  if (isError || !club) {
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
      <ClubDetailHero club={club} />

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
              <ClubDetailOverview
                club={club}
                onSeeAllPhotos={() => setTab("photos")}
              />
            ) : null}

            {tab === "courts" ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
                <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">
                  {t("courtsPlaceholder", { count: club.courtsCount })}
                </p>
              </div>
            ) : null}

            {tab === "photos" ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {club.gallery.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={src}
                      alt={`${club.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {tab === "reviews" ? (
              <div className="space-y-4">
                {reviewsQuery.isLoading ? (
                  <p className="text-sm text-slate-500">{t("loadingReviews")}</p>
                ) : null}
                {reviewsQuery.isError ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
                    <p className="text-sm text-slate-500">{t("reviewsError")}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3"
                      onClick={() => void reviewsQuery.refetch()}
                    >
                      {t("retry")}
                    </Button>
                  </div>
                ) : null}
                {reviewsQuery.data ? (
                  <>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                      <Star className="h-5 w-5 fill-[#C0FF00] text-[#C0FF00]" />
                      <span className="text-lg font-black text-[#0B1A2D]">
                        {reviewsQuery.data.average.toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({reviewsQuery.data.count})
                      </span>
                    </div>
                    {reviewsQuery.data.items.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        {t("reviewsPlaceholder", {
                          count: reviewsQuery.data.count,
                        })}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {reviewsQuery.data.items.map((review) => (
                          <li
                            key={review.id}
                            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-[#0B1A2D]">
                                {review.author}
                              </p>
                              <span className="text-xs font-bold text-slate-500">
                                {review.rating}/5
                              </span>
                            </div>
                            {review.comment ? (
                              <p className="mt-2 text-sm text-slate-600">
                                {review.comment}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="min-w-0 lg:col-span-4">
            <ClubDetailSidebar club={club} />
          </div>
        </div>
      </div>
    </div>
  );
}
