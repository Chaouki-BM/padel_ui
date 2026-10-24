import {
  type CoachSpaceAvailabilityDay,
  type CoachSpaceClient,
  type CoachSpaceDashboard,
  type CoachSpaceRequest,
} from "@/types";

export const coachSpaceDashboardSeed: CoachSpaceDashboard = {
  profile: {
    id: "coach-space-1",
    displayName: "Sami Ben Ali",
    badge: "PRO ELITE (P1000)",
    city: "Tunis",
    clubName: "Padel Club Marsa",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
    rating: 4.9,
    reviewCount: 124,
    sessionsCoached: 250,
  },
  kpis: [
    {
      id: "revenue",
      value: "4 850 TND",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      id: "sessions",
      value: "38",
      trend: "+4",
      trendPositive: true,
    },
    {
      id: "clients",
      value: "12",
      trend: "+2",
      trendPositive: true,
    },
    {
      id: "rating",
      value: "4.92",
      trend: "+0.05",
      trendPositive: true,
    },
  ],
  upcomingSessions: [
    {
      id: "cs-1",
      clientName: "Yassine Mansour",
      clientInitials: "YM",
      sessionType: "individual",
      dateLabel: "Demain, 24 Oct",
      startTime: "09:00",
      endTime: "10:30",
      durationMinutes: 90,
      status: "confirmed",
    },
    {
      id: "cs-2",
      clientName: "Sara Ben Amor",
      clientInitials: "SB",
      sessionType: "group",
      dateLabel: "Demain, 24 Oct",
      startTime: "14:00",
      endTime: "15:30",
      durationMinutes: 90,
      status: "pending",
    },
    {
      id: "cs-3",
      clientName: "Karim Trabelsi",
      clientInitials: "KT",
      sessionType: "video",
      dateLabel: "Aujourd'hui",
      startTime: "18:00",
      endTime: "19:00",
      durationMinutes: 60,
      status: "completed",
    },
    {
      id: "cs-4",
      clientName: "Leila Gharbi",
      clientInitials: "LG",
      sessionType: "individual",
      dateLabel: "Vendredi, 25 Oct",
      startTime: "10:00",
      endTime: "11:00",
      durationMinutes: 60,
      status: "confirmed",
    },
  ],
  performance: [
    { sessionType: "individual", count: 24, percent: 65 },
    { sessionType: "group", count: 10, percent: 25 },
    { sessionType: "video", count: 4, percent: 10 },
  ],
  todayLabel: "Mercredi 23 Oct",
  todaySlots: [
    { time: "08:00", status: "occupied" },
    { time: "09:30", status: "occupied" },
    { time: "11:00", status: "occupied" },
    { time: "12:30", status: "occupied" },
    { time: "14:00", status: "occupied" },
    { time: "15:30", status: "free" },
    { time: "17:00", status: "occupied" },
    { time: "18:30", status: "free" },
  ],
  alerts: [
    {
      id: "alert-1",
      type: "payment",
      title: "Paiement reçu",
      description: "Karim Trabelsi — 80 TND",
      timeAgo: "Il y a 15 min",
    },
    {
      id: "alert-2",
      type: "review",
      title: "Nouvel avis 5★",
      description: "Selim R. a laissé un avis",
      timeAgo: "Il y a 2 h",
    },
    {
      id: "alert-3",
      type: "document",
      title: "Documents requis",
      description: "Assurance expire dans 15 jours",
      timeAgo: "Il y a 1 j",
    },
  ],
};

export const coachSpaceRequestsSeed: CoachSpaceRequest[] = [
  {
    id: "req-1",
    clientName: "Hatem Mejri",
    clientInitials: "HM",
    sessionType: "individual",
    preferredDate: "26/10/2024",
    preferredTime: "10:00",
    durationMinutes: 60,
    message: "Focus technique sur la volée et le smash.",
    status: "pending",
    price: 80,
  },
  {
    id: "req-2",
    clientName: "Nour Ben Salah",
    clientInitials: "NB",
    sessionType: "group",
    preferredDate: "27/10/2024",
    preferredTime: "16:00",
    durationMinutes: 90,
    message: "Séance groupe (4 joueurs) niveau débutant.",
    status: "pending",
    price: 120,
  },
  {
    id: "req-3",
    clientName: "Amine Khelifi",
    clientInitials: "AK",
    sessionType: "video",
    preferredDate: "28/10/2024",
    preferredTime: "19:00",
    durationMinutes: 45,
    message: "Analyse vidéo de mon dernier match.",
    status: "accepted",
    price: 50,
  },
];

export const coachSpaceClientsSeed: CoachSpaceClient[] = [
  {
    id: "client-1",
    displayName: "Yassine Mansour",
    initials: "YM",
    level: "P250",
    sessionsCount: 18,
    lastSessionAt: "22/10/2024",
    totalSpent: 1440,
  },
  {
    id: "client-2",
    displayName: "Sara Ben Amor",
    initials: "SB",
    level: "P100",
    sessionsCount: 12,
    lastSessionAt: "20/10/2024",
    totalSpent: 960,
  },
  {
    id: "client-3",
    displayName: "Karim Trabelsi",
    initials: "KT",
    level: "P500",
    sessionsCount: 24,
    lastSessionAt: "23/10/2024",
    totalSpent: 1920,
  },
  {
    id: "client-4",
    displayName: "Leila Gharbi",
    initials: "LG",
    level: "P100",
    sessionsCount: 8,
    lastSessionAt: "18/10/2024",
    totalSpent: 640,
  },
  {
    id: "client-5",
    displayName: "Selim Riahi",
    initials: "SR",
    level: "P250",
    sessionsCount: 6,
    lastSessionAt: "15/10/2024",
    totalSpent: 480,
  },
];

const AVAILABILITY_TIMES = [
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "20:00",
];

export function buildCoachSpaceAvailability(
  date: string,
): CoachSpaceAvailabilityDay {
  let hash = 0;
  for (let i = 0; i < date.length; i += 1) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return {
    date,
    slots: AVAILABILITY_TIMES.map((time, index) => ({
      time,
      status: (hash + index) % 3 === 0 ? "free" : "occupied",
    })),
  };
}
