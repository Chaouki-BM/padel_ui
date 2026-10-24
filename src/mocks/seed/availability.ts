import { type SlotPeriod, type SlotStatus } from "@/lib/constants";
import { type AvailabilityCourt, type AvailabilitySlot, type Club } from "@/types";

type SlotSeed = {
  startTime: string;
  endTime: string;
  price: number;
  period: SlotPeriod;
  discountPercent?: number;
};

const SLOT_TEMPLATE: SlotSeed[] = [
  { startTime: "07:00", endTime: "08:30", price: 50, period: "morning", discountPercent: 15 },
  { startTime: "08:30", endTime: "10:00", price: 60, period: "morning", discountPercent: 15 },
  { startTime: "10:00", endTime: "11:30", price: 65, period: "morning" },
  { startTime: "11:30", endTime: "13:00", price: 65, period: "morning" },
  { startTime: "13:00", endTime: "14:30", price: 70, period: "afternoon" },
  { startTime: "14:30", endTime: "16:00", price: 70, period: "afternoon", discountPercent: 10 },
  { startTime: "16:00", endTime: "17:30", price: 75, period: "afternoon" },
  { startTime: "17:30", endTime: "19:00", price: 80, period: "afternoon" },
  { startTime: "19:00", endTime: "20:30", price: 90, period: "evening" },
  { startTime: "20:30", endTime: "22:00", price: 100, period: "evening" },
  { startTime: "22:00", endTime: "23:30", price: 110, period: "evening" },
  { startTime: "23:30", endTime: "01:00", price: 120, period: "evening" },
];

const COURT_DEFS = [
  { id: "court-1", name: "Terrain 1", label: "Central" },
  { id: "court-2", name: "Terrain 2", label: "Indoor" },
  { id: "court-3", name: "Terrain 3", label: "Panoramic" },
  { id: "court-4", name: "Terrain 4", label: "Outdoor" },
] as const;

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function statusFor(
  seedKey: string,
  index: number,
): SlotStatus {
  const bucket = hash(`${seedKey}:${index}`) % 10;
  if (bucket === 0) return "maintenance";
  if (bucket === 1 || bucket === 2) return "occupied";
  if (bucket === 3) return "reserved";
  return "available";
}

function buildSlots(seedKey: string, courtId: string): AvailabilitySlot[] {
  return SLOT_TEMPLATE.map((slot, index) => {
    const status = statusFor(seedKey, index);
    return {
      id: `${courtId}-${slot.startTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      status,
      period: slot.period,
      discountPercent:
        status === "available" && slot.discountPercent
          ? slot.discountPercent
          : null,
    };
  });
}

export function buildClubAvailability(
  club: Club,
  date: string,
  courtType = "Padel Double (Standard)",
): {
  clubId: string;
  clubSlug: string;
  date: string;
  courtType: string;
  courts: AvailabilityCourt[];
} {
  const courts = COURT_DEFS.map((court) => ({
    id: `${club.id}-${court.id}`,
    name: court.name,
    label: court.label,
    slots: buildSlots(`${club.slug}:${date}:${court.id}`, `${club.id}-${court.id}`),
  }));

  return {
    clubId: club.id,
    clubSlug: club.slug,
    date,
    courtType,
    courts,
  };
}

