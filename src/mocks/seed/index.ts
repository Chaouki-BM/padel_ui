import {
  adminClubsSeed,
  adminComplaintsSeed,
  adminDashboardSeed,
  adminPaymentsSeed,
  adminUsersSeed,
  sponsorDashboardSeed,
} from "@/mocks/seed/admin";
import { clubsSeed } from "@/mocks/seed/clubs";
import { coachesSeed } from "@/mocks/seed/coaches";
import {
  clubCourtsSeed,
  clubDashboardSeed,
  clubEventsSeed,
  clubOffersSeed,
  clubPlayersSeed,
} from "@/mocks/seed/club-dashboard";
import {
  coachSpaceClientsSeed,
  coachSpaceDashboardSeed,
  coachSpaceRequestsSeed,
} from "@/mocks/seed/coach-space";
import { openMatchesSeed } from "@/mocks/seed/open-matches";

export const seed = {
  clubs: clubsSeed,
  coaches: coachesSeed,
  openMatches: openMatchesSeed,
  coachSpaceDashboard: coachSpaceDashboardSeed,
  coachSpaceRequests: coachSpaceRequestsSeed,
  coachSpaceClients: coachSpaceClientsSeed,
  clubDashboard: clubDashboardSeed,
  clubCourts: clubCourtsSeed,
  clubPlayers: clubPlayersSeed,
  clubEvents: clubEventsSeed,
  clubOffers: clubOffersSeed,
  adminDashboard: adminDashboardSeed,
  adminUsers: adminUsersSeed,
  adminClubs: adminClubsSeed,
  adminPayments: adminPaymentsSeed,
  adminComplaints: adminComplaintsSeed,
  sponsorDashboard: sponsorDashboardSeed,
};
