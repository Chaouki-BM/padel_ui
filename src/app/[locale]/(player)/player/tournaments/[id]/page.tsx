"use client";

import { useTranslations } from "next-intl";
import { MobilePageStub } from "@/components/shared/MobilePageStub";

export default function PlayerTournamentDetailPage() {
  const t = useTranslations("pages.player");
  return <MobilePageStub title={t("tournamentDetail")} />;
}
