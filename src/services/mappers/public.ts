import { LEVEL_CODES, type LevelCode, type SlotPeriod } from "@/lib/constants";
import { minutesToHm } from "@/lib/time";
import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  asStringArray,
} from "@/lib/api-unwrap";
import { type Club, type ClubAmenity, type Coach, type Match } from "@/types";

const AMENITIES: ClubAmenity[] = [
  "wifi",
  "parking",
  "cafeteria",
  "lockers",
  "shop",
  "racket_rental",
];

function periodFromHm(hm: string): SlotPeriod {
  const hour = Number(hm.slice(0, 2));
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function parseStartHm(raw: Record<string, unknown>, durationMin: number): {
  startTime: string;
  endTime: string;
} {
  if (typeof raw.startMin === "number") {
    const start = minutesToHm(raw.startMin);
    const end = minutesToHm(raw.startMin + durationMin);
    return { startTime: start, endTime: end };
  }
  if (typeof raw.startAt === "string") {
    const d = new Date(raw.startAt);
    if (!Number.isNaN(d.getTime())) {
      const startMin = d.getHours() * 60 + d.getMinutes();
      return {
        startTime: minutesToHm(startMin),
        endTime: minutesToHm(startMin + durationMin),
      };
    }
  }
  if (typeof raw.startTime === "string") {
    const start = raw.startTime.slice(0, 5);
    try {
      const [h, m] = start.split(":").map(Number);
      const startMin = (h ?? 0) * 60 + (m ?? 0);
      return { startTime: start, endTime: minutesToHm(startMin + durationMin) };
    } catch {
      return { startTime: start, endTime: asString(raw.endTime, start) };
    }
  }
  return { startTime: "00:00", endTime: minutesToHm(durationMin) };
}

function toLevel(value: unknown): LevelCode {
  const s = asString(value, "P100");
  if ((LEVEL_CODES as readonly string[]).includes(s)) {
    return s as LevelCode;
  }
  return "P100";
}

export function mapClub(rawUnknown: unknown): Club {
  const raw = asRecord(rawUnknown);
  const address = asString(raw.address);
  const city = asString(raw.city);
  const photos = asStringArray(raw.photos);
  const gallery = asStringArray(raw.gallery);
  const amenitiesRaw = Array.isArray(raw.amenities) ? raw.amenities : [];
  const amenities = amenitiesRaw
    .map((a) => asString(a).toLowerCase().replace(/-/g, "_"))
    .filter((a): a is ClubAmenity =>
      (AMENITIES as readonly string[]).includes(a),
    );

  const courts = Array.isArray(raw.courts) ? raw.courts : [];
  const courtsCount =
    asNumber(raw.courtsCount, 0) ||
    asNumber(raw.activeCourtsCount, 0) ||
    courts.length ||
    1;

  return {
    id: asString(raw.id),
    slug: asString(raw.slug, asString(raw.id)),
    name: asString(raw.name, "Club"),
    city,
    location: asString(raw.location, address || city),
    imageUrl:
      asString(raw.imageUrl) ||
      asString(raw.logoUrl) ||
      photos[0] ||
      gallery[0] ||
      "/images/club-placeholder.jpg",
    courtsCount: Math.max(1, courtsCount),
    priceFrom: asNumber(raw.priceFrom, asNumber(raw.minPrice, 0)),
    rating: asNumber(raw.rating, asNumber(raw.averageRating, 0)),
    availableNow: asBoolean(raw.availableNow, true),
    isPremium: asBoolean(raw.isPremium, false),
    reviewCount: asNumber(raw.reviewCount, 0),
    address: address || city,
    openToday: asString(raw.openToday, asString(raw.hoursToday, "—")),
    description: asString(raw.description),
    amenities,
    gallery: gallery.length > 0 ? gallery : photos,
    faqs: Array.isArray(raw.faqs)
      ? raw.faqs.map((f, i) => {
          const faq = asRecord(f);
          return {
            id: asString(faq.id, `faq-${i}`),
            question: asString(faq.question),
            answer: asString(faq.answer),
          };
        })
      : [],
    openingHours: Array.isArray(raw.openingHours)
      ? raw.openingHours.map((h) => {
          const row = asRecord(h);
          return {
            day: asString(row.day, asString(row.weekday)),
            hours: asString(row.hours, asString(row.label, "—")),
          };
        })
      : [],
    phone: asString(raw.phone),
    website: asString(raw.website),
    facebookUrl:
      raw.facebookUrl === null || raw.facebookUrl === undefined
        ? null
        : asString(raw.facebookUrl),
    instagramUrl:
      raw.instagramUrl === null || raw.instagramUrl === undefined
        ? null
        : asString(raw.instagramUrl),
  };
}

export function mapClubAvailability(
  rawUnknown: unknown,
  slug: string,
  date: string,
  durationMin: number,
  courtType: string,
) {
  const raw = asRecord(rawUnknown);
  const courtsRaw = Array.isArray(raw.courts)
    ? raw.courts
    : Array.isArray(raw.items)
      ? raw.items
      : [];

  const courts = courtsRaw.map((c, courtIndex) => {
    const court = asRecord(c);
    const slotsRaw = Array.isArray(court.slots)
      ? court.slots
      : Array.isArray(court.starts)
        ? court.starts
        : Array.isArray(court.bookableStarts)
          ? court.bookableStarts
          : [];

    const slots = slotsRaw.map((s, slotIndex) => {
      const slot = asRecord(
        typeof s === "object" && s !== null ? s : { startMin: s, price: 0 },
      );
      const { startTime, endTime } = parseStartHm(slot, durationMin);
      return {
        id: asString(slot.id, `${asString(court.id, `c${courtIndex}`)}-${startTime}-${slotIndex}`),
        startTime,
        endTime,
        price: asNumber(slot.price, asNumber(slot.amount, 0)),
        status: "available" as const,
        period: periodFromHm(startTime),
        discountPercent:
          slot.discountPercent === null || slot.discountPercent === undefined
            ? null
            : asNumber(slot.discountPercent),
      };
    });

    return {
      id: asString(court.id, `court-${courtIndex}`),
      name: asString(court.name, `Court ${courtIndex + 1}`),
      label: asString(court.label, asString(court.type, asString(court.name, `T${courtIndex + 1}`))),
      slots,
    };
  });

  return {
    clubId: asString(raw.clubId, asString(raw.id)),
    clubSlug: asString(raw.clubSlug, slug),
    date: asString(raw.date, date),
    courtType: asString(raw.courtType, courtType),
    courts,
  };
}

export function mapCoach(rawUnknown: unknown): Coach {
  const raw = asRecord(rawUnknown);
  const id = asString(raw.id);
  const first = asString(raw.firstName);
  const last = asString(raw.lastName);
  const displayName =
    asString(raw.displayName) ||
    [first, last].filter(Boolean).join(" ") ||
    asString(raw.name, "Coach");

  return {
    id,
    slug: asString(raw.slug, id),
    displayName,
    city: asString(raw.city),
    location: asString(raw.location, asString(raw.city)),
    imageUrl:
      asString(raw.imageUrl) ||
      asString(raw.avatarUrl) ||
      asString(raw.photoUrl) ||
      "/images/coach-placeholder.jpg",
    level: toLevel(raw.level ?? asStringArray(raw.levelsTaught)[0]),
    specialties: asStringArray(raw.specialties).length
      ? asStringArray(raw.specialties)
      : asStringArray(raw.levelsTaught),
    pricePerHour: asNumber(raw.pricePerHour, 0),
    rating: asNumber(raw.rating, asNumber(raw.averageRating, 0)),
    reviewCount: asNumber(raw.reviewCount, 0),
    availableNow: asBoolean(raw.availableNow, true),
    bio: asString(raw.bio),
    yearsExperience: asNumber(
      raw.yearsExperience,
      asNumber(raw.experienceYears, 0),
    ),
    phone: asString(raw.phone),
    languages: asStringArray(raw.languages),
    clubName: asString(raw.clubName, asString(asRecord(raw.club).name)),
  };
}

export function mapOpenMatch(rawUnknown: unknown): Match {
  const raw = asRecord(rawUnknown);
  const club = asRecord(raw.club);
  const playersRaw = Array.isArray(raw.players)
    ? raw.players
    : Array.isArray(raw.participants)
      ? raw.participants
      : [];

  const players = playersRaw.map((p, i) => {
    const row = asRecord(p);
    const profile = asRecord(row.profile);
    const name =
      asString(row.displayName) ||
      [asString(profile.firstName), asString(profile.lastName)]
        .filter(Boolean)
        .join(" ") ||
      asString(row.firstName, `Joueur ${i + 1}`);
    return {
      id: asString(row.id, asString(row.playerId, `p-${i}`)),
      displayName: name,
      avatarUrl:
        row.avatarUrl === null || row.avatarUrl === undefined
          ? null
          : asString(row.avatarUrl),
      level: toLevel(row.level ?? profile.level),
    };
  });

  const maxPlayers = asNumber(raw.maxPlayers, 4);
  const spotsLeft = asNumber(raw.spotsLeft, maxPlayers - players.length);
  const statusRaw = asString(raw.status, "OPEN").toUpperCase();
  const status =
    statusRaw === "FULL" || statusRaw === "CONFIRMED"
      ? ("confirmed" as const)
      : statusRaw === "CANCELLED"
        ? ("cancelled" as const)
        : ("open" as const);

  const startAt = asString(raw.startAt);
  let date = asString(raw.date);
  let time = asString(raw.time);
  if (startAt) {
    const d = new Date(startAt);
    if (!Number.isNaN(d.getTime())) {
      date = d.toLocaleDateString("fr-TN", { day: "numeric", month: "short" });
      time = d.toLocaleTimeString("fr-TN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  const levelMin = raw.levelMin ? toLevel(raw.levelMin) : null;
  const levelMax = raw.levelMax ? toLevel(raw.levelMax) : null;

  return {
    id: asString(raw.id),
    clubId: asString(raw.clubId, asString(club.id)),
    clubName: asString(raw.clubName, asString(club.name, "Club")),
    clubLocation: asString(
      raw.clubLocation,
      asString(club.city, asString(club.address)),
    ),
    date,
    time,
    pricePerPlayer: asNumber(raw.pricePerPlayer, 0),
    levelMin,
    levelMax,
    allLevels: !levelMin && !levelMax,
    players,
    maxPlayers,
    paymentMethod:
      asString(raw.paymentMethod, "in_app").toLowerCase().includes("site")
        ? "on_site"
        : "in_app",
    status,
    almostFull: spotsLeft <= 1 && status === "open",
  };
}

export type RankingEntry = {
  id: string;
  position: number;
  displayName: string;
  city: string;
  rating: number;
  level: LevelCode;
};

export function mapRankingEntry(rawUnknown: unknown, index: number): RankingEntry {
  const raw = asRecord(rawUnknown);
  const profile = asRecord(raw.profile);
  const displayName =
    asString(raw.displayName) ||
    [asString(profile.firstName), asString(profile.lastName)]
      .filter(Boolean)
      .join(" ") ||
    asString(raw.firstName, `Joueur ${index + 1}`);

  return {
    id: asString(raw.id, asString(raw.playerId, `rank-${index}`)),
    position: asNumber(raw.position, index + 1),
    displayName,
    city: asString(raw.city, asString(profile.city)),
    rating: asNumber(raw.rating, asNumber(profile.rating, 0)),
    level: toLevel(raw.level ?? profile.level),
  };
}

export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  type: string;
  city: string;
  startAt: string;
  clubName: string;
};

export function mapEvent(rawUnknown: unknown): PublicEvent {
  const raw = asRecord(rawUnknown);
  const club = asRecord(raw.club);
  return {
    id: asString(raw.id),
    slug: asString(raw.slug, asString(raw.id)),
    title: asString(raw.title, asString(raw.name, "Événement")),
    type: asString(raw.type, asString(raw.kind, "EVENT")),
    city: asString(raw.city, asString(club.city)),
    startAt: asString(raw.startAt, asString(raw.startsAt)),
    clubName: asString(raw.clubName, asString(club.name)),
  };
}

export type ClubReviewSummary = {
  average: number;
  count: number;
  items: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
};

export function mapReviews(rawUnknown: unknown): ClubReviewSummary {
  const raw = asRecord(rawUnknown);
  const itemsRaw = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.reviews)
      ? raw.reviews
      : Array.isArray(raw.latest)
        ? raw.latest
        : [];

  return {
    average: asNumber(raw.average, asNumber(raw.averageRating, 0)),
    count: asNumber(raw.count, asNumber(raw.total, itemsRaw.length)),
    items: itemsRaw.map((r, i) => {
      const row = asRecord(r);
      const author = asRecord(row.author);
      return {
        id: asString(row.id, `rev-${i}`),
        author:
          asString(row.authorName) ||
          asString(author.displayName) ||
          asString(row.displayName, "Joueur"),
        rating: asNumber(row.rating, 0),
        comment: asString(row.comment, asString(row.body)),
        createdAt: asString(row.createdAt),
      };
    }),
  };
}
