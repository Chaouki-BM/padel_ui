import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";

export const clubsHandlers = [
  http.get("*/api/v1/clubs/:slug/reviews", () => {
    return HttpResponse.json({
      average: 4.6,
      count: 12,
      items: [
        {
          id: "rev-1",
          authorName: "Amine",
          rating: 5,
          comment: "Excellent club",
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),
  http.get("*/api/v1/clubs/:slug", ({ params }) => {
    const slug = String(params.slug);
    const club = db.clubs.find((item) => item.slug === slug);
    if (!club) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Club not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(club);
  }),
  http.get("*/api/v1/clubs", ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const q = url.searchParams.get("q")?.toLowerCase();
    let clubs = db.clubs;
    if (city) {
      clubs = clubs.filter(
        (c) => c.city.toLowerCase() === city.toLowerCase(),
      );
    }
    if (q) {
      clubs = clubs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }
    return HttpResponse.json(clubs);
  }),
];
