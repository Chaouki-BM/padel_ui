import { z } from "zod";
import {
  BOOKING_STATUSES,
  ADMIN_ACTIVITY_TYPES,
  ADMIN_USER_ROLES,
  ADMIN_USER_STATUSES,
  CLUB_COURT_STATUSES,
  CLUB_RESERVATION_STATUSES,
  COACH_ALERT_TYPES,
  SPONSOR_CAMPAIGN_STATUSES,
  COACH_DAY_SLOT_STATUSES,
  COACH_REQUEST_STATUSES,
  COACH_SESSION_STATUSES,
  COACH_SESSION_TYPES,
  LEVEL_CODES,
  OPEN_MATCH_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PLAYER_STATUSES,
  ROLES,
  SLOT_PERIODS,
  SLOT_STATUSES,
} from "@/lib/constants";

export const clubAmenitySchema = z.enum([
  "wifi",
  "parking",
  "cafeteria",
  "lockers",
  "shop",
  "racket_rental",
]);

export const clubFaqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const clubOpeningHoursSchema = z.object({
  day: z.string(),
  hours: z.string(),
});

export const clubSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  location: z.string(),
  imageUrl: z.string(),
  courtsCount: z.number().int().positive(),
  priceFrom: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  availableNow: z.boolean(),
  isPremium: z.boolean(),
  reviewCount: z.number().int().nonnegative(),
  address: z.string(),
  openToday: z.string(),
  description: z.string(),
  amenities: z.array(clubAmenitySchema),
  gallery: z.array(z.string()),
  faqs: z.array(clubFaqSchema),
  openingHours: z.array(clubOpeningHoursSchema),
  phone: z.string(),
  website: z.string(),
  facebookUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
});

export const clubsResponseSchema = z.object({
  data: z.array(clubSchema),
});

export const clubResponseSchema = z.object({
  data: clubSchema,
});

export const availabilitySlotSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  price: z.number().nonnegative(),
  status: z.enum(SLOT_STATUSES),
  period: z.enum(SLOT_PERIODS),
  discountPercent: z.number().nullable(),
});

export const availabilityCourtSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  slots: z.array(availabilitySlotSchema),
});

export const clubAvailabilitySchema = z.object({
  clubId: z.string(),
  clubSlug: z.string(),
  date: z.string(),
  courtType: z.string(),
  courts: z.array(availabilityCourtSchema),
});

export const clubAvailabilityResponseSchema = z.object({
  data: clubAvailabilitySchema,
});

export const courtSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  name: z.string(),
});

export const playerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  phone: z.string(),
});

export const coachSchema = z.object({
  id: z.string(),
  slug: z.string(),
  displayName: z.string(),
  city: z.string(),
  location: z.string(),
  imageUrl: z.string(),
  level: z.enum(LEVEL_CODES),
  specialties: z.array(z.string()),
  pricePerHour: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  availableNow: z.boolean(),
  bio: z.string(),
  yearsExperience: z.number().int().nonnegative(),
  phone: z.string(),
  languages: z.array(z.string()),
  clubName: z.string(),
});

export const coachesResponseSchema = z.object({
  data: z.array(coachSchema),
});

export const coachResponseSchema = z.object({
  data: coachSchema,
});

export const coachAvailabilitySchema = z.object({
  coachId: z.string(),
  coachSlug: z.string(),
  date: z.string(),
  sessionMinutes: z.number().int().positive(),
  slots: z.array(availabilitySlotSchema),
});

export const coachAvailabilityResponseSchema = z.object({
  data: coachAvailabilitySchema,
});

export const bookingSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  courtId: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  status: z.enum(BOOKING_STATUSES),
});

export const openMatchPlayerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  level: z.enum(LEVEL_CODES),
});

export const openMatchSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  clubName: z.string(),
  clubLocation: z.string(),
  date: z.string(),
  time: z.string(),
  pricePerPlayer: z.number(),
  levelMin: z.enum(LEVEL_CODES).nullable(),
  levelMax: z.enum(LEVEL_CODES).nullable(),
  allLevels: z.boolean(),
  players: z.array(openMatchPlayerSchema),
  maxPlayers: z.number(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  status: z.enum(OPEN_MATCH_STATUSES),
  almostFull: z.boolean(),
});

export const openMatchesResponseSchema = z.object({
  data: z.array(openMatchSchema),
  total: z.number(),
});

export const levelCodeSchema = z.enum(LEVEL_CODES);
export const roleSchema = z.enum(ROLES);
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export const playerStatusSchema = z.enum(PLAYER_STATUSES);

export const coachSpaceProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  badge: z.string(),
  city: z.string(),
  clubName: z.string(),
  imageUrl: z.string(),
  coverUrl: z.string(),
  rating: z.number(),
  reviewCount: z.number().int().nonnegative(),
  sessionsCoached: z.number().int().nonnegative(),
});

export const coachSpaceKpiSchema = z.object({
  id: z.string(),
  value: z.string(),
  trend: z.string(),
  trendPositive: z.boolean(),
});

export const coachSpaceSessionSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  clientInitials: z.string(),
  sessionType: z.enum(COACH_SESSION_TYPES),
  dateLabel: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  durationMinutes: z.number().int().positive(),
  status: z.enum(COACH_SESSION_STATUSES),
});

export const coachPerformanceItemSchema = z.object({
  sessionType: z.enum(COACH_SESSION_TYPES),
  count: z.number().int().nonnegative(),
  percent: z.number().min(0).max(100),
});

export const coachDaySlotSchema = z.object({
  time: z.string(),
  status: z.enum(COACH_DAY_SLOT_STATUSES),
});

export const coachAlertSchema = z.object({
  id: z.string(),
  type: z.enum(COACH_ALERT_TYPES),
  title: z.string(),
  description: z.string(),
  timeAgo: z.string(),
});

export const coachSpaceDashboardSchema = z.object({
  profile: coachSpaceProfileSchema,
  kpis: z.array(coachSpaceKpiSchema),
  upcomingSessions: z.array(coachSpaceSessionSchema),
  performance: z.array(coachPerformanceItemSchema),
  todaySlots: z.array(coachDaySlotSchema),
  todayLabel: z.string(),
  alerts: z.array(coachAlertSchema),
});

export const coachSpaceDashboardResponseSchema = z.object({
  data: coachSpaceDashboardSchema,
});

export const coachSpaceRequestSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  clientInitials: z.string(),
  sessionType: z.enum(COACH_SESSION_TYPES),
  preferredDate: z.string(),
  preferredTime: z.string(),
  durationMinutes: z.number().int().positive(),
  message: z.string(),
  status: z.enum(COACH_REQUEST_STATUSES),
  price: z.number().nonnegative(),
});

export const coachSpaceRequestsResponseSchema = z.object({
  data: z.array(coachSpaceRequestSchema),
});

export const coachSpaceClientSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  initials: z.string(),
  level: z.enum(LEVEL_CODES),
  sessionsCount: z.number().int().nonnegative(),
  lastSessionAt: z.string(),
  totalSpent: z.number().nonnegative(),
});

export const coachSpaceClientsResponseSchema = z.object({
  data: z.array(coachSpaceClientSchema),
});

export const coachSpaceAvailabilityDaySchema = z.object({
  date: z.string(),
  slots: z.array(coachDaySlotSchema),
});

export const coachSpaceAvailabilityResponseSchema = z.object({
  data: coachSpaceAvailabilityDaySchema,
});

export const clubDashKpiSchema = z.object({
  id: z.string(),
  value: z.string(),
  trend: z.string(),
  trendPositive: z.boolean(),
});

export const clubRevenuePointSchema = z.object({
  month: z.string(),
  reservations: z.number(),
  shop: z.number(),
});

export const clubRecentReservationSchema = z.object({
  id: z.string(),
  playerName: z.string(),
  courtName: z.string(),
  timeRange: z.string(),
  status: z.enum(CLUB_RESERVATION_STATUSES),
  price: z.number().nonnegative(),
});

export const clubAgendaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  timeRange: z.string(),
  meta: z.string(),
  live: z.boolean(),
});

export const clubWeatherSchema = z.object({
  city: z.string(),
  temperatureC: z.number(),
  label: z.string(),
  ideal: z.boolean(),
});

export const clubDashboardSchema = z.object({
  clubName: z.string(),
  kpis: z.array(clubDashKpiSchema),
  revenueGoal: z.number(),
  revenueSeries: z.array(clubRevenuePointSchema),
  recentReservations: z.array(clubRecentReservationSchema),
  agenda: z.array(clubAgendaItemSchema),
  weather: clubWeatherSchema,
});

export const clubDashboardResponseSchema = z.object({
  data: clubDashboardSchema,
});

export const clubManagedCourtSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  status: z.enum(CLUB_COURT_STATUSES),
  pricePerHour: z.number().nonnegative(),
  bookingsToday: z.number().int().nonnegative(),
});

export const clubManagedCourtsResponseSchema = z.object({
  data: z.array(clubManagedCourtSchema),
});

export const clubManagedPlayerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  initials: z.string(),
  level: z.enum(LEVEL_CODES),
  bookingsCount: z.number().int().nonnegative(),
  lastVisitAt: z.string(),
  totalSpent: z.number().nonnegative(),
});

export const clubManagedPlayersResponseSchema = z.object({
  data: z.array(clubManagedPlayerSchema),
});

export const clubManagedEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  timeRange: z.string(),
  players: z.number().int().nonnegative(),
  status: z.enum(["upcoming", "live", "done"]),
});

export const clubManagedEventsResponseSchema = z.object({
  data: z.array(clubManagedEventSchema),
});

export const clubOfferSchema = z.object({
  id: z.string(),
  title: z.string(),
  discountPercent: z.number().nonnegative(),
  validUntil: z.string(),
  active: z.boolean(),
});

export const clubOffersResponseSchema = z.object({
  data: z.array(clubOfferSchema),
});

export const adminKpiSchema = z.object({
  id: z.string(),
  value: z.string(),
  trend: z.string(),
  trendPositive: z.boolean(),
});

export const adminGrowthPointSchema = z.object({
  month: z.string(),
  revenue: z.number(),
  reservations: z.number(),
});

export const adminActivitySchema = z.object({
  id: z.string(),
  type: z.enum(ADMIN_ACTIVITY_TYPES),
  title: z.string(),
  description: z.string(),
  timeAgo: z.string(),
});

export const adminUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string(),
  role: z.enum(ADMIN_USER_ROLES),
  roleLabel: z.string(),
  status: z.enum(ADMIN_USER_STATUSES),
  reliability: z.number().min(0).max(100),
});

export const adminDashboardSchema = z.object({
  kpis: z.array(adminKpiSchema),
  growthSeries: z.array(adminGrowthPointSchema),
  activities: z.array(adminActivitySchema),
  recentUsers: z.array(adminUserSchema),
  systemUptime: z.string(),
});

export const adminDashboardResponseSchema = z.object({
  data: adminDashboardSchema,
});

export const adminUsersResponseSchema = z.object({
  data: z.array(adminUserSchema),
});

export const adminClubRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  courts: z.number().int().nonnegative(),
  status: z.enum(["active", "pending", "suspended"]),
  revenueMonth: z.number().nonnegative(),
});

export const adminClubsResponseSchema = z.object({
  data: z.array(adminClubRowSchema),
});

export const adminPaymentRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  userName: z.string(),
  amount: z.number(),
  status: z.enum(["success", "pending", "failed", "flagged"]),
  date: z.string(),
});

export const adminPaymentsResponseSchema = z.object({
  data: z.array(adminPaymentRowSchema),
});

export const adminComplaintSchema = z.object({
  id: z.string(),
  subject: z.string(),
  fromName: z.string(),
  status: z.enum(["open", "in_progress", "resolved"]),
  createdAt: z.string(),
});

export const adminComplaintsResponseSchema = z.object({
  data: z.array(adminComplaintSchema),
});

export const sponsorCampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  sponsorName: z.string(),
  imageUrl: z.string(),
  status: z.enum(SPONSOR_CAMPAIGN_STATUSES),
  impressions: z.number().nonnegative(),
  ctr: z.number().nonnegative(),
  budgetUsed: z.number().nonnegative(),
  budgetTotal: z.number().nonnegative(),
});

export const sponsorDashboardSchema = z.object({
  kpis: z.array(adminKpiSchema),
  performanceSeries: z.array(
    z.object({
      day: z.string(),
      impressions: z.number(),
      clicks: z.number(),
    }),
  ),
  campaigns: z.array(sponsorCampaignSchema),
  partners: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      city: z.string(),
    }),
  ),
  tips: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export const sponsorDashboardResponseSchema = z.object({
  data: sponsorDashboardSchema,
});

export type ClubInput = z.infer<typeof clubSchema>;

