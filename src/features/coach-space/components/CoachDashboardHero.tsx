"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatchCoachProfile } from "@/hooks/useCoachSpace";
import { type CoachSpaceProfile } from "@/types";

type CoachDashboardHeroProps = {
  profile: CoachSpaceProfile;
};

export function CoachDashboardHero({ profile }: CoachDashboardHeroProps) {
  const t = useTranslations("coachSpaceDashboard");
  const patchProfile = usePatchCoachProfile();
  const [editing, setEditing] = useState(false);
  const [city, setCity] = useState(profile.city);
  const [price, setPrice] = useState("60");
  const [bio, setBio] = useState("");

  async function onSaveProfile() {
    try {
      await patchProfile.mutateAsync({
        city: city.trim() || undefined,
        pricePerHour: Number(price) || undefined,
        bio: bio.trim() || undefined,
      });
      toast.success(t("profileSaved"));
      setEditing(false);
    } catch {
      toast.error(t("profileError"));
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <div className="relative min-h-[200px] sm:min-h-[220px]">
        <Image
          src={profile.coverUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2D]/95 via-[#0B1A2D]/75 to-[#0B1A2D]/40" />
        <div className="relative z-10 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#C0FF00] sm:h-24 sm:w-24">
              <Image
                src={profile.imageUrl}
                alt={profile.displayName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 pb-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {t("coachPrefix")} {profile.displayName}
                </h1>
                <Badge className="rounded-md border-none bg-[#C0FF00] text-[10px] font-bold text-[#0B1A2D] hover:bg-[#C0FF00]">
                  {profile.badge}
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-xs font-medium text-white/80 sm:text-sm">
                <MapPin className="h-3.5 w-3.5 text-[#C0FF00]" />
                {profile.city}, {profile.clubName}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-[#C0FF00] text-[#C0FF00]" />
                  {profile.rating.toFixed(1)} ({t("reviews", { count: profile.reviewCount })})
                </span>
                <span>
                  {t("sessionsCoached", { count: profile.sessionsCoached })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              onClick={() => toast.success(t("newSessionToast"))}
              className="h-11 rounded-xl bg-[#C0FF00] font-bold text-[#0B1A2D] hover:bg-[#C0FF00]/90"
            >
              <Plus className="h-4 w-4" />
              {t("newSession")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing((v) => !v)}
              className="h-11 rounded-xl border-white/30 bg-white/10 font-bold text-white hover:bg-white/20"
            >
              {t("editProfile")}
            </Button>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 border-t border-slate-100 bg-white p-4 sm:p-5">
          <p className="text-sm font-bold text-[#0B1A2D]">{t("editProfileTitle")}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("cityPlaceholder")}
              className="h-10"
            />
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min={1}
              placeholder={t("pricePlaceholder")}
              className="h-10"
            />
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              className="h-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={patchProfile.isPending}
              onClick={() => void onSaveProfile()}
              className="h-10 rounded-xl bg-[#0B1A2D] text-[#C0FF00]"
            >
              {t("saveProfile")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(false)}
              className="h-10 rounded-xl"
            >
              {t("cancelEdit")}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
