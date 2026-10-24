import { type Club, type ClubAmenity, type ClubFaq, type ClubOpeningHours } from "@/types";

const DEFAULT_AMENITIES: ClubAmenity[] = [
  "wifi",
  "parking",
  "cafeteria",
  "lockers",
  "shop",
  "racket_rental",
];

const DEFAULT_HOURS: ClubOpeningHours[] = [
  { day: "Lundi", hours: "07:00 - 00:00" },
  { day: "Mardi", hours: "07:00 - 00:00" },
  { day: "Mercredi", hours: "07:00 - 00:00" },
  { day: "Jeudi", hours: "07:00 - 00:00" },
  { day: "Vendredi", hours: "07:00 - 00:00" },
  { day: "Samedi", hours: "08:00 - 00:00" },
  { day: "Dimanche", hours: "08:00 - 00:00" },
];

const DEFAULT_FAQS: ClubFaq[] = [
  {
    id: "cancel",
    question: "Politique d'annulation",
    answer:
      "Annulation gratuite jusqu'à 24h avant le début de la réservation. Passé ce délai, des frais partiels ou totaux peuvent s'appliquer selon le règlement du club.",
  },
  {
    id: "rental",
    question: "Location de matériel",
    answer:
      "Raquettes et balles disponibles à la location sur place. Réservez votre matériel au moment de la réservation du terrain.",
  },
  {
    id: "membership",
    question: "Adhésion Club",
    answer:
      "Les membres bénéficient de tarifs préférentiels et d'un accès prioritaire aux créneaux. Contactez le club pour les formules d'abonnement.",
  },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1554068865-24cecd4e34f8?w=800&q=80",
  "https://images.unsplash.com/photo-1622279457486-640c4cb68c6e?w=800&q=80",
  "https://images.unsplash.com/photo-1617083277666-f495ba2d1b85?w=800&q=80",
  "https://images.unsplash.com/photo-1595435934242-5d438b8b8b99?w=800&q=80",
];

function club(
  partial: Omit<
    Club,
    | "amenities"
    | "gallery"
    | "faqs"
    | "openingHours"
    | "isPremium"
    | "reviewCount"
    | "openToday"
    | "description"
    | "address"
    | "phone"
    | "website"
    | "facebookUrl"
    | "instagramUrl"
  > &
    Partial<Club>,
): Club {
  return {
    amenities: DEFAULT_AMENITIES,
    gallery: GALLERY,
    faqs: DEFAULT_FAQS,
    openingHours: DEFAULT_HOURS,
    isPremium: false,
    reviewCount: 42,
    openToday: "07:00 - 00:00",
    description:
      "Club de padel moderne offrant des terrains de qualité, des vestiaires confortables et un espace détente pour les joueurs de tous niveaux.",
    address: `${partial.location}, ${partial.city}, Tunisie`,
    phone: "+216 71 000 000",
    website: "www.padeltunisie.tn",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    ...partial,
  };
}

export const clubsSeed: Club[] = [
  club({
    id: "club-1",
    slug: "padel-house-la-marsa",
    name: "Padel House La Marsa",
    city: "Tunis",
    location: "La Marsa",
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34f8?w=800&q=80",
    courtsCount: 6,
    priceFrom: 80,
    rating: 4.8,
    availableNow: true,
    isPremium: true,
    reviewCount: 96,
  }),
  club({
    id: "club-2",
    slug: "padel-elite-gammarth",
    name: "Padel Elite Gammarth",
    city: "Tunis",
    location: "Zone Touristique Gammarth",
    imageUrl:
      "https://images.unsplash.com/photo-1622279457486-640c4cb68c6e?w=800&q=80",
    courtsCount: 8,
    priceFrom: 120,
    rating: 4.9,
    availableNow: true,
    isPremium: true,
    reviewCount: 128,
    address: "Zone Touristique Gammarth, Tunis, Tunisie",
    openToday: "07:00 - 00:00",
    description:
      "Situé au cœur de la zone touristique de Gammarth, Padel Elite est le club de référence pour les joueurs exigeants. Nos 8 terrains panoramiques offrent une expérience de jeu unique face à la mer Méditerranée.\n\nNous proposons un cadre premium avec vestiaires haut de gamme, boutique Pro Shop et coaching personnalisé pour tous les niveaux.",
    phone: "+216 71 000 000",
    website: "www.padelelite.tn",
  }),
  club({
    id: "club-3",
    slug: "the-box-padel-soukra",
    name: "The Box Padel Soukra",
    city: "Tunis",
    location: "La Soukra",
    imageUrl:
      "https://images.unsplash.com/photo-1617083277666-f495ba2d1b85?w=800&q=80",
    courtsCount: 5,
    priceFrom: 90,
    rating: 4.7,
    availableNow: false,
    reviewCount: 64,
  }),
  club({
    id: "club-4",
    slug: "padel-club-carthage",
    name: "Padel Club Carthage",
    city: "Tunis",
    location: "Carthage",
    imageUrl:
      "https://images.unsplash.com/photo-1595435934242-5d438b8b8b99?w=800&q=80",
    courtsCount: 3,
    priceFrom: 75,
    rating: 4.5,
    availableNow: true,
  }),
  club({
    id: "club-5",
    slug: "lake-padel-tunis",
    name: "Lake Padel Tunis",
    city: "Tunis",
    location: "Lac 2",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    courtsCount: 8,
    priceFrom: 110,
    rating: 4.9,
    availableNow: true,
    isPremium: true,
    reviewCount: 110,
  }),
  club({
    id: "club-6",
    slug: "sousse-padel-arena",
    name: "Sousse Padel Arena",
    city: "Sousse",
    location: "Centre-ville",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
    courtsCount: 4,
    priceFrom: 70,
    rating: 4.4,
    availableNow: true,
  }),
  club({
    id: "club-7",
    slug: "monastir-padel-club",
    name: "Monastir Padel Club",
    city: "Monastir",
    location: "Skanes",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=800&q=80",
    courtsCount: 3,
    priceFrom: 65,
    rating: 4.3,
    availableNow: false,
  }),
  club({
    id: "club-8",
    slug: "olympique-padel",
    name: "Olympique Padel",
    city: "Tunis",
    location: "Ariana",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    courtsCount: 5,
    priceFrom: 85,
    rating: 4.6,
    availableNow: true,
  }),
];
