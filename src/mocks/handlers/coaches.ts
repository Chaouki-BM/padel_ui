import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";

function withWeeklyAvailability<T extends { id: string }>(coach: T) {
  return {
    ...coach,
    availabilities: [
      { weekday: "MON", fromMin: 1080, toMin: 1200 },
      { weekday: "WED", fromMin: 1080, toMin: 1200 },
      { weekday: "SAT", fromMin: 600, toMin: 720 },
    ],
  };
}

export const coachesHandlers = [
  http.get("*/api/v1/coaches/:id", ({ params }) => {
    const id = String(params.id);
    const coach = db.coaches.find(
      (item) => item.slug === id || item.id === id,
    );
    if (!coach) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Coach not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(withWeeklyAvailability(coach));
  }),
  http.get("*/api/v1/coaches", ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    let coaches = db.coaches;
    if (city) {
      coaches = coaches.filter(
        (c) => c.city.toLowerCase() === city.toLowerCase(),
      );
    }
    return HttpResponse.json(coaches.map(withWeeklyAvailability));
  }),
];
