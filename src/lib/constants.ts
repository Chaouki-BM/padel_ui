export const LEVEL_CODES = [
  "P25",
  "P50",
  "P100",
  "P250",
  "P500",
  "P1000",
] as const;

export type LevelCode = (typeof LEVEL_CODES)[number];

export const ROLES = [
  "player",
  "club",
  "coach",
  "admin",
  "sponsor",
] as const;

export type Role = (typeof ROLES)[number];

export const BOOKING_STATUSES = [
  "held",
  "pending_payment",
  "confirmed",
  "cancelled",
  "completed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "success",
  "failed",
  "pay_on_site",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PLAYER_STATUSES = [
  "normal",
  "watch",
  "suspended",
  "blocked",
] as const;

export type PlayerStatus = (typeof PLAYER_STATUSES)[number];

export const SLOT_STATUSES = [
  "available",
  "occupied",
  "reserved",
  "maintenance",
] as const;

export type SlotStatus = (typeof SLOT_STATUSES)[number];

export const SLOT_PERIODS = ["morning", "afternoon", "evening"] as const;

export type SlotPeriod = (typeof SLOT_PERIODS)[number];

export const OPEN_MATCH_STATUSES = [
  "open",
  "confirmed",
  "cancelled",
] as const;

export type OpenMatchStatus = (typeof OPEN_MATCH_STATUSES)[number];

export const PAYMENT_METHODS = [
  "in_app",
  "on_site",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const TIMEZONE = "Africa/Tunis";

export const COURT_TYPES = [
  "Padel Double (Standard)",
  "Padel Single",
  "Padel Indoor",
] as const;

export type CourtType = (typeof COURT_TYPES)[number];

export const COACH_SESSION_TYPES = [
  "individual",
  "group",
  "video",
] as const;

export type CoachSessionType = (typeof COACH_SESSION_TYPES)[number];

export const COACH_SESSION_STATUSES = [
  "confirmed",
  "pending",
  "completed",
] as const;

export type CoachSessionStatus = (typeof COACH_SESSION_STATUSES)[number];

export const COACH_DAY_SLOT_STATUSES = ["free", "occupied"] as const;

export type CoachDaySlotStatus = (typeof COACH_DAY_SLOT_STATUSES)[number];

export const COACH_ALERT_TYPES = [
  "payment",
  "review",
  "document",
] as const;

export type CoachAlertType = (typeof COACH_ALERT_TYPES)[number];

export const COACH_REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
] as const;

export type CoachRequestStatus = (typeof COACH_REQUEST_STATUSES)[number];

export const CLUB_RESERVATION_STATUSES = [
  "confirmed",
  "pending",
  "paid",
  "cancelled",
] as const;

export type ClubReservationStatus = (typeof CLUB_RESERVATION_STATUSES)[number];

export const CLUB_COURT_STATUSES = [
  "available",
  "occupied",
  "maintenance",
] as const;

export type ClubCourtStatus = (typeof CLUB_COURT_STATUSES)[number];

export const ADMIN_USER_ROLES = [
  "player",
  "coach",
  "club_manager",
  "admin",
] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export const ADMIN_USER_STATUSES = ["active", "inactive", "sanctioned"] as const;

export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export const ADMIN_ACTIVITY_TYPES = [
  "club",
  "payment",
  "users",
  "sanction",
  "system",
] as const;

export type AdminActivityType = (typeof ADMIN_ACTIVITY_TYPES)[number];

export const SPONSOR_CAMPAIGN_STATUSES = [
  "active",
  "paused",
  "draft",
  "ended",
] as const;

export type SponsorCampaignStatus = (typeof SPONSOR_CAMPAIGN_STATUSES)[number];
