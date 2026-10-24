import { http, HttpResponse } from "msw";
import { db } from "@/mocks/db";

export const openMatchesHandlers = [
  http.get("*/api/v1/open-matches/:id", ({ params }) => {
    const id = String(params.id);
    const match = db.openMatches.find((item) => item.id === id);
    if (!match) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Match not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(match);
  }),
  http.get("*/api/v1/open-matches", () => {
    return HttpResponse.json({
      items: db.openMatches,
      total: db.openMatches.length,
    });
  }),
];
