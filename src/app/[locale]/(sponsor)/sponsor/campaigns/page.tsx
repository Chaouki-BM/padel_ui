"use client";

import { useTranslations } from "next-intl";
import { MobilePageStub } from "@/components/shared/MobilePageStub";

export default function SponsorCampaignsPage() {
  const t = useTranslations("pages.sponsor");
  return <MobilePageStub title={t("campaigns")} />;
}
