import { adminHandlers } from "@/mocks/handlers/admin";
import { adsHandlers } from "@/mocks/handlers/ads";
import { availabilityHandlers } from "@/mocks/handlers/availability";
import { bookingsHandlers } from "@/mocks/handlers/bookings";
import { clubsHandlers } from "@/mocks/handlers/clubs";
import { clubDashboardHandlers } from "@/mocks/handlers/club-dashboard";
import { coachesHandlers } from "@/mocks/handlers/coaches";
import { coachSpaceHandlers } from "@/mocks/handlers/coach-space";
import { eventsHandlers } from "@/mocks/handlers/events";
import { openMatchesHandlers } from "@/mocks/handlers/open-matches";
import { playHandlers } from "@/mocks/handlers/play";
import { rankingsHandlers } from "@/mocks/handlers/rankings";

export const handlers = [
  ...adsHandlers,
  ...adminHandlers,
  ...availabilityHandlers,
  ...bookingsHandlers,
  ...coachesHandlers,
  ...coachSpaceHandlers,
  ...clubDashboardHandlers,
  ...clubsHandlers,
  ...openMatchesHandlers,
  ...eventsHandlers,
  ...rankingsHandlers,
  ...playHandlers,
];


