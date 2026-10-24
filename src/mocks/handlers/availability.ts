import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";
import { buildClubAvailability } from "@/mocks/seed/availability";

export const availabilityHandlers = [
  http.get("*/api/v1/clubs/:slug/availability", ({ params, request }) => {
    const slug = String(params.slug);
    const club = db.clubs.find((item) => item.slug === slug);
    if (!club) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Club not found" },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const date =
      url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    const courtType =
      url.searchParams.get("courtType") ?? "Padel Double (Standard)";

    return HttpResponse.json(buildClubAvailability(club, date, courtType));
  }),
];
