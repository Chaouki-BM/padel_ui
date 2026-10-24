import {
  type Role,
  type BookingStatus,
  type AdminActivityType,
  type AdminUserRole,
  type AdminUserStatus,
  type ClubCourtStatus,
  type ClubReservationStatus,
  type CoachAlertType,
  type SponsorCampaignStatus,
  type CoachDaySlotStatus,
  type CoachRequestStatus,
  type CoachSessionStatus,
  type CoachSessionType,
  type LevelCode,
  type OpenMatchStatus,
  type PaymentMethod,
  type SlotPeriod,
  type SlotStatus,
} from "@/lib/constants";

export type Id = string;

export type ClubAmenity =
  | "wifi"
  | "parking"
  | "cafeteria"
  | "lockers"
  | "shop"
  | "racket_rental";

export type ClubOpeningHours = {
  day: string;
  hours: string;
};

export type ClubFaq = {
  id: string;
  question: string;
  answer: string;
};

export type Club = {
  id: Id;
  slug: string;
  name: string;
  city: string;
  location: string;
  imageUrl: string;
  courtsCount: number;
  priceFrom: number;
  rating: number;
  availableNow: boolean;
  isPremium: boolean;
  reviewCount: number;
  address: string;
  openToday: string;
  description: string;
  amenities: ClubAmenity[];
  gallery: string[];
  faqs: ClubFaq[];
  openingHours: ClubOpeningHours[];
  phone: string;
  website: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
};

export type Court = {
  id: Id;
  clubId: Id;
  name: string;
};

export type AvailabilitySlot = {
  id: Id;
  startTime: string;
  endTime: string;
  price: number;
  status: SlotStatus;
  period: SlotPeriod;
  discountPercent: number | null;
};

export type AvailabilityCourt = {
  id: Id;
  name: string;
  label: string;
  slots: AvailabilitySlot[];
};

export type ClubAvailability = {
  clubId: Id;
  clubSlug: string;
  date: string;
  courtType: string;
  courts: AvailabilityCourt[];
};

export type Player = {
  id: Id;
  displayName: string;
  phone: string;
};

export type Coach = {
  id: Id;
  slug: string;
  displayName: string;
  city: string;
  location: string;
  imageUrl: string;
  level: LevelCode;
  specialties: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  availableNow: boolean;
  bio: string;
  yearsExperience: number;
  phone: string;
  languages: string[];
  clubName: string;
};

export type CoachAvailability = {
  coachId: Id;
  coachSlug: string;
  date: string;
  sessionMinutes: number;
  slots: AvailabilitySlot[];
};

export type Booking = {
  id: Id;
  clubId: Id;
  courtId: Id;
  startAt: string;
  endAt: string;
  status: BookingStatus;
};

export type OpenMatchPlayer = {
  id: Id;
  displayName: string;
  avatarUrl: string | null;
  level: LevelCode;
};

export type Match = {
  id: Id;
  clubId: Id;
  clubName: string;
  clubLocation: string;
  date: string;
  time: string;
  pricePerPlayer: number;
  levelMin: LevelCode | null;
  levelMax: LevelCode | null;
  allLevels: boolean;
  players: OpenMatchPlayer[];
  maxPlayers: number;
  paymentMethod: PaymentMethod;
  status: OpenMatchStatus;
  almostFull: boolean;
};

export type Event = {
  id: Id;
  slug: string;
  title: string;
};

export type Tournament = {
  id: Id;
  slug: string;
  title: string;
};

export type SessionUser = {
  id: Id;
  role: Role;
};

export type CoachSpaceProfile = {
  id: Id;
  displayName: string;
  badge: string;
  city: string;
  clubName: string;
  imageUrl: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  sessionsCoached: number;
};

export type CoachSpaceKpi = {
  id: string;
  value: string;
  trend: string;
  trendPositive: boolean;
};

export type CoachSpaceSession = {
  id: Id;
  clientName: string;
  clientInitials: string;
  sessionType: CoachSessionType;
  dateLabel: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: CoachSessionStatus;
};

export type CoachPerformanceItem = {
  sessionType: CoachSessionType;
  count: number;
  percent: number;
};

export type CoachDaySlot = {
  time: string;
  status: CoachDaySlotStatus;
};

export type CoachAlert = {
  id: Id;
  type: CoachAlertType;
  title: string;
  description: string;
  timeAgo: string;
};

export type CoachSpaceDashboard = {
  profile: CoachSpaceProfile;
  kpis: CoachSpaceKpi[];
  upcomingSessions: CoachSpaceSession[];
  performance: CoachPerformanceItem[];
  todaySlots: CoachDaySlot[];
  todayLabel: string;
  alerts: CoachAlert[];
};

export type CoachSpaceRequest = {
  id: Id;
  clientName: string;
  clientInitials: string;
  sessionType: CoachSessionType;
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  message: string;
  status: CoachRequestStatus;
  price: number;
};

export type CoachSpaceClient = {
  id: Id;
  displayName: string;
  initials: string;
  level: LevelCode;
  sessionsCount: number;
  lastSessionAt: string;
  totalSpent: number;
};

export type CoachSpaceAvailabilityDay = {
  date: string;
  slots: CoachDaySlot[];
};

export type ClubDashKpi = {
  id: string;
  value: string;
  trend: string;
  trendPositive: boolean;
};

export type ClubRevenuePoint = {
  month: string;
  reservations: number;
  shop: number;
};

export type ClubRecentReservation = {
  id: Id;
  playerId?: Id;
  playerName: string;
  courtName: string;
  timeRange: string;
  status: ClubReservationStatus;
  price: number;
};

export type ClubAgendaItem = {
  id: Id;
  title: string;
  timeRange: string;
  meta: string;
  live: boolean;
};

export type ClubWeather = {
  city: string;
  temperatureC: number;
  label: string;
  ideal: boolean;
};

export type ClubDashboard = {
  clubName: string;
  kpis: ClubDashKpi[];
  revenueGoal: number;
  revenueSeries: ClubRevenuePoint[];
  recentReservations: ClubRecentReservation[];
  agenda: ClubAgendaItem[];
  weather: ClubWeather;
};

export type ClubManagedCourt = {
  id: Id;
  name: string;
  type: string;
  status: ClubCourtStatus;
  pricePerHour: number;
  bookingsToday: number;
};

export type ClubManagedPlayer = {
  id: Id;
  displayName: string;
  initials: string;
  level: LevelCode;
  bookingsCount: number;
  lastVisitAt: string;
  totalSpent: number;
};

export type ClubManagedEvent = {
  id: Id;
  title: string;
  date: string;
  timeRange: string;
  players: number;
  status: "upcoming" | "live" | "done";
};

export type ClubOffer = {
  id: Id;
  title: string;
  discountPercent: number;
  validUntil: string;
  active: boolean;
};

export type AdminKpi = {
  id: string;
  value: string;
  trend: string;
  trendPositive: boolean;
};

export type AdminGrowthPoint = {
  month: string;
  revenue: number;
  reservations: number;
};

export type AdminActivity = {
  id: Id;
  type: AdminActivityType;
  title: string;
  description: string;
  timeAgo: string;
};

export type AdminUser = {
  id: Id;
  displayName: string;
  email: string;
  role: AdminUserRole;
  roleLabel: string;
  status: AdminUserStatus;
  reliability: number;
};

export type AdminDashboard = {
  kpis: AdminKpi[];
  growthSeries: AdminGrowthPoint[];
  activities: AdminActivity[];
  recentUsers: AdminUser[];
  systemUptime: string;
};

export type AdminClubRow = {
  id: Id;
  name: string;
  city: string;
  courts: number;
  status: "active" | "pending" | "suspended";
  revenueMonth: number;
};

export type AdminPaymentRow = {
  id: Id;
  label: string;
  userName: string;
  amount: number;
  status: "success" | "pending" | "failed" | "flagged";
  date: string;
};

export type AdminComplaint = {
  id: Id;
  subject: string;
  fromName: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
};

export type SponsorCampaign = {
  id: Id;
  name: string;
  sponsorName: string;
  imageUrl: string;
  status: SponsorCampaignStatus;
  impressions: number;
  ctr: number;
  budgetUsed: number;
  budgetTotal: number;
};

export type SponsorPartner = {
  id: Id;
  name: string;
  city: string;
};

export type SponsorDashboard = {
  kpis: AdminKpi[];
  performanceSeries: { day: string; impressions: number; clicks: number }[];
  campaigns: SponsorCampaign[];
  partners: SponsorPartner[];
  tips: { id: Id; title: string; description: string }[];
};
