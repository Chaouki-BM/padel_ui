import { http, HttpResponse } from "msw";

const DEMO_RANKINGS = [
  {
    id: "p1",
    position: 1,
    displayName: "Amine Ben Youssef",
    city: "Tunis",
    rating: 1420,
    level: "P500",
  },
  {
    id: "p2",
    position: 2,
    displayName: "Sarra Mansouri",
    city: "La Marsa",
    rating: 1385,
    level: "P250",
  },
  {
    id: "p3",
    position: 3,
    displayName: "Mehdi Ghoula",
    city: "Tunis",
    rating: 1310,
    level: "P250",
  },
];

export const rankingsHandlers = [
  http.get("*/api/v1/rankings", () => HttpResponse.json(DEMO_RANKINGS)),
];
