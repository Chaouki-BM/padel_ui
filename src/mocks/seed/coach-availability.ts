import { type SlotPeriod, type SlotStatus } from "@/lib/constants";
import { type AvailabilitySlot, type Coach, type CoachAvailability } from "@/types";

type SlotSeed = {
  startTime: string;
  endTime: string;
  period: SlotPeriod;
};

const SLOT_60: SlotSeed[] = [
  { startTime: "08:00", endTime: "09:00", period: "morning" },
  { startTime: "09:00", endTime: "10:00", period: "morning" },
  { startTime: "10:00", endTime: "11:00", period: "morning" },
  { startTime: "11:00", endTime: "12:00", period: "morning" },
  { startTime: "14:00", endTime: "15:00", period: "afternoon" },
  { startTime: "15:00", endTime: "16:00", period: "afternoon" },
  { startTime: "16:00", endTime: "17:00", period: "afternoon" },
  { startTime: "17:00", endTime: "18:00", period: "afternoon" },
  { startTime: "18:00", endTime: "19:00", period: "evening" },
  { startTime: "19:00", endTime: "20:00", period: "evening" },
  { startTime: "20:00", endTime: "21:00", period: "evening" },
  { startTime: "21:00", endTime: "22:00", period: "evening" },
];

const SLOT_90: SlotSeed[] = [
  { startTime: "08:00", endTime: "09:30", period: "morning" },
  { startTime: "09:30", endTime: "11:00", period: "morning" },
  { startTime: "11:00", endTime: "12:30", period: "morning" },
  { startTime: "14:00", endTime: "15:30", period: "afternoon" },
  { startTime: "15:30", endTime: "17:00", period: "afternoon" },
  { startTime: "17:00", endTime: "18:30", period: "afternoon" },
  { startTime: "18:30", endTime: "20:00", period: "evening" },
  { startTime: "20:00", endTime: "21:30", period: "evening" },
];

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function statusFor(seedKey: string, index: number): SlotStatus {
  const bucket = hash(`${seedKey}:${index}`) % 10;
  if (bucket === 0) return "maintenance";
  if (bucket === 1 || bucket === 2) return "occupied";
  if (bucket === 3) return "reserved";
  return "available";
}

export function buildCoachAvailability(
  coach: Coach,
  date: string,
  sessionMinutes: number,
): CoachAvailability {
  const template = sessionMinutes === 90 ? SLOT_90 : SLOT_60;
  const priceMultiplier = sessionMinutes / 60;
  const basePrice = Math.round(coach.pricePerHour * priceMultiplier);

  const slots: AvailabilitySlot[] = template.map((slot, index) => {
    const status = statusFor(`${coach.slug}:${date}:${sessionMinutes}`, index);
    const eveningBoost = slot.period === "evening" ? 10 : 0;
    return {
      id: `${coach.id}-${sessionMinutes}-${slot.startTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: basePrice + eveningBoost,
      status,
      period: slot.period,
      discountPercent:
        status === "available" && slot.period === "morning" ? 10 : null,
    };
  });

  return {
    coachId: coach.id,
    coachSlug: coach.slug,
    date,
    sessionMinutes,
    slots,
  };
}

export const SESSION_DURATIONS = [60, 90] as const;
