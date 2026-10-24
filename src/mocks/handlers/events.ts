import { http, HttpResponse } from "msw";

const DEMO_EVENTS = [
  {
    id: "evt-1",
    slug: "americano-du-samedi",
    title: "Americano du samedi",
    type: "AMERICANO",
    city: "Tunis",
    startAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    clubName: "Padel House Carthage",
    participants: [],
  },
  {
    id: "evt-2",
    slug: "open-tunis-16",
    title: "Open Tunis 16",
    type: "TOURNAMENT",
    city: "Tunis",
    startAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    clubName: "The Wall Padel",
    participants: [],
  },
];

export const eventsHandlers = [
  http.get("*/api/v1/events/:slug/standings", () =>
    HttpResponse.json({ rows: [] }),
  ),
  http.get("*/api/v1/events/:slug/teams", () => HttpResponse.json([])),
  http.get("*/api/v1/events/:slug/groups", () => HttpResponse.json([])),
  http.get("*/api/v1/events/:slug/bracket", () => HttpResponse.json(null)),
  http.get("*/api/v1/events/:slug", ({ params }) => {
    const slug = String(params.slug);
    const event = DEMO_EVENTS.find((e) => e.slug === slug);
    if (!event) {
      return HttpResponse.json(
        { statusCode: 404, error: "Not Found", message: "Event not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(event);
  }),
  http.get("*/api/v1/events", () => HttpResponse.json(DEMO_EVENTS)),
];
