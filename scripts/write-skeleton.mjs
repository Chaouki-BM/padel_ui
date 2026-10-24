import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function page(pageKey) {
  return `import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages");
  return <h1>{t("${pageKey}")}</h1>;
}
`;
}

const pages = [
  ["src/app/[locale]/(public)/page.tsx", "landing"],
  ["src/app/[locale]/(public)/clubs/[city]/page.tsx", "publicClubsByCity"],
  ["src/app/[locale]/(public)/club/[slug]/page.tsx", "publicClub"],
  ["src/app/[locale]/(public)/coach/[slug]/page.tsx", "publicCoach"],
  ["src/app/[locale]/(public)/events/page.tsx", "publicEvents"],
  ["src/app/[locale]/(public)/event/[slug]/page.tsx", "publicEvent"],
  ["src/app/[locale]/(public)/tournaments/page.tsx", "publicTournaments"],
  ["src/app/[locale]/(auth)/login/page.tsx", "login"],
  ["src/app/[locale]/(auth)/register/page.tsx", "register"],
  ["src/app/[locale]/(auth)/verify-otp/page.tsx", "verifyOtp"],
  ["src/app/[locale]/(auth)/forgot-password/page.tsx", "forgotPassword"],
  ["src/app/[locale]/(player)/home/page.tsx", "playerHome"],
  ["src/app/[locale]/(player)/clubs/page.tsx", "playerClubs"],
  ["src/app/[locale]/(player)/book/[clubSlug]/page.tsx", "playerBook"],
  ["src/app/[locale]/(player)/bookings/page.tsx", "playerBookings"],
  ["src/app/[locale]/(player)/open-matches/page.tsx", "playerOpenMatches"],
  ["src/app/[locale]/(player)/open-matches/new/page.tsx", "playerOpenMatchNew"],
  ["src/app/[locale]/(player)/open-matches/[id]/page.tsx", "playerOpenMatch"],
  ["src/app/[locale]/(player)/results/[matchId]/page.tsx", "playerResult"],
  ["src/app/[locale]/(player)/ranking/page.tsx", "playerRanking"],
  ["src/app/[locale]/(player)/events/page.tsx", "playerEvents"],
  ["src/app/[locale]/(player)/events/[id]/page.tsx", "playerEventLive"],
  ["src/app/[locale]/(player)/tournaments/[id]/page.tsx", "playerTournament"],
  ["src/app/[locale]/(player)/coaches/page.tsx", "playerCoaches"],
  ["src/app/[locale]/(player)/wallet/page.tsx", "playerWallet"],
  ["src/app/[locale]/(player)/notifications/page.tsx", "playerNotifications"],
  ["src/app/[locale]/(player)/sanctions/page.tsx", "playerSanctions"],
  ["src/app/[locale]/(player)/profile/page.tsx", "playerProfile"],
  ["src/app/[locale]/(player)/settings/page.tsx", "playerSettings"],
  ["src/app/[locale]/(club)/club-dashboard/overview/page.tsx", "clubOverview"],
  ["src/app/[locale]/(club)/club-dashboard/courts/page.tsx", "clubCourts"],
  ["src/app/[locale]/(club)/club-dashboard/calendar/page.tsx", "clubCalendar"],
  ["src/app/[locale]/(club)/club-dashboard/events/page.tsx", "clubEvents"],
  ["src/app/[locale]/(club)/club-dashboard/players/page.tsx", "clubPlayers"],
  ["src/app/[locale]/(club)/club-dashboard/offers/page.tsx", "clubOffers"],
  ["src/app/[locale]/(coach)/coach-space/profile/page.tsx", "coachProfile"],
  ["src/app/[locale]/(coach)/coach-space/availability/page.tsx", "coachAvailability"],
  ["src/app/[locale]/(coach)/coach-space/requests/page.tsx", "coachRequests"],
  ["src/app/[locale]/(coach)/coach-space/clients/page.tsx", "coachClients"],
  ["src/app/[locale]/(admin)/admin/overview/page.tsx", "adminOverview"],
  ["src/app/[locale]/(admin)/admin/finance/page.tsx", "adminFinance"],
  ["src/app/[locale]/(admin)/admin/users/page.tsx", "adminUsers"],
  ["src/app/[locale]/(admin)/admin/clubs/page.tsx", "adminClubs"],
  ["src/app/[locale]/(admin)/admin/coaches/page.tsx", "adminCoaches"],
  ["src/app/[locale]/(admin)/admin/events/page.tsx", "adminEvents"],
  ["src/app/[locale]/(admin)/admin/payments/page.tsx", "adminPayments"],
  ["src/app/[locale]/(admin)/admin/sponsors/page.tsx", "adminSponsors"],
  ["src/app/[locale]/(admin)/admin/ads/page.tsx", "adminAds"],
  ["src/app/[locale]/(admin)/admin/promotions/page.tsx", "adminPromotions"],
  ["src/app/[locale]/(admin)/admin/complaints/page.tsx", "adminComplaints"],
  ["src/app/[locale]/(admin)/admin/settings/page.tsx", "adminSettings"],
  ["src/app/[locale]/(sponsor)/sponsor/campaigns/page.tsx", "sponsorCampaigns"],
  ["src/app/[locale]/(sponsor)/sponsor/assets/page.tsx", "sponsorAssets"],
];

for (const [file, key] of pages) {
  write(file, page(key));
}

const gitkeeps = [
  "src/components/features/booking/.gitkeep",
  "src/components/features/open-match/.gitkeep",
  "src/components/features/results/.gitkeep",
  "src/components/features/events/.gitkeep",
  "src/components/features/tournament/.gitkeep",
  "src/components/features/wallet/.gitkeep",
  "src/components/features/coach/.gitkeep",
  "src/components/features/admin/.gitkeep",
  "src/lib/draw/.gitkeep",
  "src/lib/rating/.gitkeep",
  "src/lib/refund/.gitkeep",
];

for (const file of gitkeeps) {
  write(file, "");
}

console.log(`Wrote ${pages.length} pages and ${gitkeeps.length} gitkeeps`);
