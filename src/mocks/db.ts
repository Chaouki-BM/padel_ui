import {
  type AdminClubRow,
  type AdminComplaint,
  type AdminDashboard,
  type AdminPaymentRow,
  type AdminUser,
  type Club,
  type ClubDashboard,
  type ClubManagedCourt,
  type ClubManagedEvent,
  type ClubManagedPlayer,
  type ClubOffer,
  type Coach,
  type CoachSpaceClient,
  type CoachSpaceDashboard,
  type CoachSpaceRequest,
  type Match,
  type SponsorDashboard,
} from "@/types";
import { seed } from "@/mocks/seed";

export type MockDb = {
  clubs: Club[];
  coaches: Coach[];
  openMatches: Match[];
  coachSpaceDashboard: CoachSpaceDashboard;
  coachSpaceRequests: CoachSpaceRequest[];
  coachSpaceClients: CoachSpaceClient[];
  clubDashboard: ClubDashboard;
  clubCourts: ClubManagedCourt[];
  clubPlayers: ClubManagedPlayer[];
  clubEvents: ClubManagedEvent[];
  clubOffers: ClubOffer[];
  adminDashboard: AdminDashboard;
  adminUsers: AdminUser[];
  adminClubs: AdminClubRow[];
  adminPayments: AdminPaymentRow[];
  adminComplaints: AdminComplaint[];
  sponsorDashboard: SponsorDashboard;
};

export function createDb(initial: MockDb = seed): MockDb {
  return {
    clubs: [...initial.clubs],
    coaches: [...initial.coaches],
    openMatches: [...initial.openMatches],
    coachSpaceDashboard: {
      ...initial.coachSpaceDashboard,
      kpis: [...initial.coachSpaceDashboard.kpis],
      upcomingSessions: [...initial.coachSpaceDashboard.upcomingSessions],
      performance: [...initial.coachSpaceDashboard.performance],
      todaySlots: [...initial.coachSpaceDashboard.todaySlots],
      alerts: [...initial.coachSpaceDashboard.alerts],
    },
    coachSpaceRequests: [...initial.coachSpaceRequests],
    coachSpaceClients: [...initial.coachSpaceClients],
    clubDashboard: {
      ...initial.clubDashboard,
      kpis: [...initial.clubDashboard.kpis],
      revenueSeries: [...initial.clubDashboard.revenueSeries],
      recentReservations: [...initial.clubDashboard.recentReservations],
      agenda: [...initial.clubDashboard.agenda],
      weather: { ...initial.clubDashboard.weather },
    },
    clubCourts: [...initial.clubCourts],
    clubPlayers: [...initial.clubPlayers],
    clubEvents: [...initial.clubEvents],
    clubOffers: [...initial.clubOffers],
    adminDashboard: {
      ...initial.adminDashboard,
      kpis: [...initial.adminDashboard.kpis],
      growthSeries: [...initial.adminDashboard.growthSeries],
      activities: [...initial.adminDashboard.activities],
      recentUsers: [...initial.adminDashboard.recentUsers],
    },
    adminUsers: [...initial.adminUsers],
    adminClubs: [...initial.adminClubs],
    adminPayments: [...initial.adminPayments],
    adminComplaints: [...initial.adminComplaints],
    sponsorDashboard: {
      ...initial.sponsorDashboard,
      kpis: [...initial.sponsorDashboard.kpis],
      performanceSeries: [...initial.sponsorDashboard.performanceSeries],
      campaigns: [...initial.sponsorDashboard.campaigns],
      partners: [...initial.sponsorDashboard.partners],
      tips: [...initial.sponsorDashboard.tips],
    },
  };
}

export const db: MockDb = createDb();
