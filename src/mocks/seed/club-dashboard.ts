import {
  type ClubDashboard,
  type ClubManagedCourt,
  type ClubManagedEvent,
  type ClubManagedPlayer,
  type ClubOffer,
} from "@/types";

export const clubDashboardSeed: ClubDashboard = {
  clubName: "Padel Elite Gammarth",
  kpis: [
    {
      id: "revenue",
      value: "12 450 TND",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      id: "reservations",
      value: "342",
      trend: "+8.2%",
      trendPositive: true,
    },
    {
      id: "players",
      value: "48",
      trend: "+15.3%",
      trendPositive: true,
    },
    {
      id: "occupancy",
      value: "76%",
      trend: "-2.1%",
      trendPositive: false,
    },
  ],
  revenueGoal: 15000,
  revenueSeries: [
    { month: "Jan", reservations: 6200, shop: 1800 },
    { month: "Fév", reservations: 7100, shop: 2100 },
    { month: "Mar", reservations: 7800, shop: 2400 },
    { month: "Avr", reservations: 8500, shop: 2200 },
    { month: "Mai", reservations: 9200, shop: 2800 },
    { month: "Juin", reservations: 10100, shop: 3200 },
  ],
  recentReservations: [
    {
      id: "BK-1021",
      playerName: "Fedi Slim",
      courtName: "Court Central",
      timeRange: "16:00 - 17:30",
      status: "confirmed",
      price: 120,
    },
    {
      id: "BK-1022",
      playerName: "Sonia Gharbi",
      courtName: "Court N°2",
      timeRange: "18:00 - 19:30",
      status: "paid",
      price: 90,
    },
    {
      id: "BK-1023",
      playerName: "Mehdi Jomaa",
      courtName: "Court N°3",
      timeRange: "20:00 - 21:30",
      status: "pending",
      price: 80,
    },
    {
      id: "BK-1024",
      playerName: "Amine Ben Youssef",
      courtName: "Court Central",
      timeRange: "10:00 - 11:30",
      status: "confirmed",
      price: 120,
    },
    {
      id: "BK-1025",
      playerName: "Karim Saidi",
      courtName: "Court N°2",
      timeRange: "21:30 - 23:00",
      status: "cancelled",
      price: 90,
    },
  ],
  agenda: [
    {
      id: "agenda-1",
      title: "Tournoi Americano P250",
      timeRange: "14:00 - 18:00",
      meta: "16 joueurs",
      live: true,
    },
    {
      id: "agenda-2",
      title: "Maintenance Court N°3",
      timeRange: "08:00 - 12:00",
      meta: "Intervention technique",
      live: false,
    },
  ],
  weather: {
    city: "Tunis",
    temperatureC: 28,
    label: "Idéal pour jouer",
    ideal: true,
  },
};

export const clubCourtsSeed: ClubManagedCourt[] = [
  {
    id: "court-1",
    name: "Court Central",
    type: "Padel Double (Vitre)",
    status: "occupied",
    pricePerHour: 80,
    bookingsToday: 6,
  },
  {
    id: "court-2",
    name: "Court N°2",
    type: "Padel Double (Panoramic)",
    status: "available",
    pricePerHour: 70,
    bookingsToday: 4,
  },
  {
    id: "court-3",
    name: "Court N°3",
    type: "Padel Indoor",
    status: "maintenance",
    pricePerHour: 90,
    bookingsToday: 0,
  },
  {
    id: "court-4",
    name: "Court Outdoor",
    type: "Padel Double (Extérieur)",
    status: "available",
    pricePerHour: 60,
    bookingsToday: 5,
  },
];

export const clubPlayersSeed: ClubManagedPlayer[] = [
  {
    id: "cp-1",
    displayName: "Fedi Slim",
    initials: "FS",
    level: "P250",
    bookingsCount: 22,
    lastVisitAt: "16/10/2024",
    totalSpent: 2640,
  },
  {
    id: "cp-2",
    displayName: "Sonia Gharbi",
    initials: "SG",
    level: "P100",
    bookingsCount: 14,
    lastVisitAt: "15/10/2024",
    totalSpent: 1260,
  },
  {
    id: "cp-3",
    displayName: "Mehdi Jomaa",
    initials: "MJ",
    level: "P500",
    bookingsCount: 31,
    lastVisitAt: "17/10/2024",
    totalSpent: 3720,
  },
  {
    id: "cp-4",
    displayName: "Karim Saidi",
    initials: "KS",
    level: "P100",
    bookingsCount: 8,
    lastVisitAt: "12/10/2024",
    totalSpent: 720,
  },
];

export const clubEventsSeed: ClubManagedEvent[] = [
  {
    id: "ce-1",
    title: "Americano Night P250",
    date: "24/10/2024",
    timeRange: "19:00 - 22:00",
    players: 16,
    status: "upcoming",
  },
  {
    id: "ce-2",
    title: "Open Club Double",
    date: "18/10/2024",
    timeRange: "09:00 - 18:00",
    players: 32,
    status: "done",
  },
  {
    id: "ce-3",
    title: "Tournoi Americano P250",
    date: "Aujourd'hui",
    timeRange: "14:00 - 18:00",
    players: 16,
    status: "live",
  },
];

export const clubOffersSeed: ClubOffer[] = [
  {
    id: "offer-1",
    title: "−15% créneaux matin",
    discountPercent: 15,
    validUntil: "31/10/2024",
    active: true,
  },
  {
    id: "offer-2",
    title: "Pack 10 heures",
    discountPercent: 10,
    validUntil: "30/11/2024",
    active: true,
  },
  {
    id: "offer-3",
    title: "Offre week-end étudiants",
    discountPercent: 20,
    validUntil: "15/09/2024",
    active: false,
  },
];
