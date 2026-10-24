import {
  type AdminClubRow,
  type AdminComplaint,
  type AdminDashboard,
  type AdminPaymentRow,
  type AdminUser,
  type SponsorDashboard,
} from "@/types";

export const adminDashboardSeed: AdminDashboard = {
  kpis: [
    {
      id: "users",
      value: "12 482",
      trend: "+14.2%",
      trendPositive: true,
    },
    {
      id: "clubs",
      value: "86",
      trend: "+4",
      trendPositive: true,
    },
    {
      id: "revenue",
      value: "42 850 TND",
      trend: "+8.1%",
      trendPositive: true,
    },
    {
      id: "sanctions",
      value: "24",
      trend: "-12.5%",
      trendPositive: true,
    },
  ],
  growthSeries: [
    { month: "Jan", revenue: 28000, reservations: 4200 },
    { month: "Fév", revenue: 31000, reservations: 4600 },
    { month: "Mar", revenue: 34000, reservations: 5100 },
    { month: "Avr", revenue: 37000, reservations: 5400 },
    { month: "Mai", revenue: 40000, reservations: 5800 },
    { month: "Juin", revenue: 42850, reservations: 6200 },
  ],
  activities: [
    {
      id: "act-1",
      type: "club",
      title: "Nouveau club approuvé",
      description: "Padel Marsa a été validé",
      timeAgo: "Il y a 2 h",
    },
    {
      id: "act-2",
      type: "payment",
      title: "Transaction suspecte",
      description: "450 TND signalés pour revue",
      timeAgo: "Il y a 4 h",
    },
    {
      id: "act-3",
      type: "users",
      title: "Nouveaux joueurs",
      description: "50 inscriptions aujourd'hui",
      timeAgo: "Il y a 6 h",
    },
    {
      id: "act-4",
      type: "sanction",
      title: "Sanction appliquée",
      description: "User #402 — No-show",
      timeAgo: "Il y a 8 h",
    },
    {
      id: "act-5",
      type: "system",
      title: "Mise à jour système",
      description: "v2.4.1 déployée",
      timeAgo: "Hier",
    },
  ],
  recentUsers: [
    {
      id: "u-1",
      displayName: "Amine Ben Youssef",
      email: "amine.by@email.tn",
      role: "player",
      roleLabel: "Joueur P100",
      status: "active",
      reliability: 98,
    },
    {
      id: "u-2",
      displayName: "Sarra Mansouri",
      email: "sarra.m@email.tn",
      role: "coach",
      roleLabel: "Coach",
      status: "active",
      reliability: 94,
    },
    {
      id: "u-3",
      displayName: "Mehdi Ghoula",
      email: "mehdi.g@email.tn",
      role: "club_manager",
      roleLabel: "Manager Club",
      status: "inactive",
      reliability: 45,
    },
    {
      id: "u-4",
      displayName: "Leila Trabelsi",
      email: "leila.t@email.tn",
      role: "player",
      roleLabel: "Joueur P250",
      status: "sanctioned",
      reliability: 62,
    },
  ],
  systemUptime: "99.9%",
};

export const adminUsersSeed: AdminUser[] = [
  ...adminDashboardSeed.recentUsers,
  {
    id: "u-5",
    displayName: "Karim Jaziri",
    email: "karim.j@email.tn",
    role: "player",
    roleLabel: "Joueur P500",
    status: "active",
    reliability: 91,
  },
  {
    id: "u-6",
    displayName: "Nour Ben Ali",
    email: "nour.ba@email.tn",
    role: "admin",
    roleLabel: "Admin",
    status: "active",
    reliability: 100,
  },
];

export const adminClubsSeed: AdminClubRow[] = [
  {
    id: "ac-1",
    name: "Padel Elite Gammarth",
    city: "Tunis",
    courts: 6,
    status: "active",
    revenueMonth: 12450,
  },
  {
    id: "ac-2",
    name: "Padel House La Marsa",
    city: "Tunis",
    courts: 4,
    status: "active",
    revenueMonth: 9800,
  },
  {
    id: "ac-3",
    name: "Lake Padel Tunis",
    city: "Tunis",
    courts: 5,
    status: "pending",
    revenueMonth: 0,
  },
  {
    id: "ac-4",
    name: "Sousse Padel Club",
    city: "Sousse",
    courts: 3,
    status: "suspended",
    revenueMonth: 2100,
  },
];

export const adminPaymentsSeed: AdminPaymentRow[] = [
  {
    id: "pay-1",
    label: "Réservation Court Central",
    userName: "Fedi Slim",
    amount: 120,
    status: "success",
    date: "17/10/2024",
  },
  {
    id: "pay-2",
    label: "Recharge wallet",
    userName: "Amine Ben Youssef",
    amount: 200,
    status: "success",
    date: "17/10/2024",
  },
  {
    id: "pay-3",
    label: "Transaction suspecte",
    userName: "Unknown",
    amount: 450,
    status: "flagged",
    date: "16/10/2024",
  },
  {
    id: "pay-4",
    label: "Séance coach",
    userName: "Sara Ben Amor",
    amount: 80,
    status: "pending",
    date: "16/10/2024",
  },
  {
    id: "pay-5",
    label: "Inscription tournoi",
    userName: "Karim Saidi",
    amount: 50,
    status: "failed",
    date: "15/10/2024",
  },
];

export const adminComplaintsSeed: AdminComplaint[] = [
  {
    id: "cmp-1",
    subject: "Remboursement non reçu",
    fromName: "Mehdi Jomaa",
    status: "open",
    createdAt: "17/10/2024",
  },
  {
    id: "cmp-2",
    subject: "Litige score match",
    fromName: "Sonia Gharbi",
    status: "in_progress",
    createdAt: "16/10/2024",
  },
  {
    id: "cmp-3",
    subject: "Club fermé sans préavis",
    fromName: "Hatem Mejri",
    status: "resolved",
    createdAt: "10/10/2024",
  },
];

export const sponsorDashboardSeed: SponsorDashboard = {
  kpis: [
    {
      id: "impressions",
      value: "479.1K",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      id: "clicks",
      value: "28.9K",
      trend: "+8.2%",
      trendPositive: true,
    },
    {
      id: "ctr",
      value: "6.03%",
      trend: "-0.4%",
      trendPositive: false,
    },
    {
      id: "revenue",
      value: "29 500 TND",
      trend: "+15.0%",
      trendPositive: true,
    },
  ],
  performanceSeries: [
    { day: "01 Nov", impressions: 62000, clicks: 3800 },
    { day: "02 Nov", impressions: 68000, clicks: 4100 },
    { day: "03 Nov", impressions: 71000, clicks: 4300 },
    { day: "04 Nov", impressions: 65000, clicks: 3900 },
    { day: "05 Nov", impressions: 74000, clicks: 4600 },
    { day: "06 Nov", impressions: 78000, clicks: 4900 },
    { day: "07 Nov", impressions: 81200, clicks: 5200 },
  ],
  campaigns: [
    {
      id: "camp-1",
      name: "Velocity Hydro Boost",
      sponsorName: "Oasis Water",
      imageUrl:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&q=80",
      status: "active",
      impressions: 125400,
      ctr: 6.8,
      budgetUsed: 3200,
      budgetTotal: 5000,
    },
    {
      id: "camp-2",
      name: "Drop Shot Collection",
      sponsorName: "Pro Racket TN",
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&q=80",
      status: "paused",
      impressions: 84200,
      ctr: 5.1,
      budgetUsed: 2100,
      budgetTotal: 4000,
    },
    {
      id: "camp-3",
      name: "National Cup Banner",
      sponsorName: "Bank of Tunis",
      imageUrl:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&q=80",
      status: "draft",
      impressions: 0,
      ctr: 0,
      budgetUsed: 0,
      budgetTotal: 8000,
    },
    {
      id: "camp-4",
      name: "Summer Courts Ads",
      sponsorName: "SportLife",
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&q=80",
      status: "ended",
      impressions: 210000,
      ctr: 7.2,
      budgetUsed: 6000,
      budgetTotal: 6000,
    },
  ],
  partners: [
    { id: "p-1", name: "Partenaire 1", city: "Tunis, TN" },
    { id: "p-2", name: "Partenaire 2", city: "Tunis, TN" },
    { id: "p-3", name: "Partenaire 3", city: "Sousse, TN" },
    { id: "p-4", name: "Partenaire 4", city: "Sfax, TN" },
    { id: "p-5", name: "Partenaire 5", city: "Tunis, TN" },
    { id: "p-6", name: "Partenaire 6", city: "Nabeul, TN" },
  ],
  tips: [
    {
      id: "tip-1",
      title: "Hausse d'engagement",
      description: "Week-ends convertissent +22% vs semaine.",
    },
    {
      id: "tip-2",
      title: "Nouvelle audience",
      description: "Ciblez les joueurs P100–P250 à Tunis.",
    },
  ],
};
