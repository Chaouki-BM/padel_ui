# Frontend Architecture

## Key idea: swappable data layer
UI components -> hooks (useClubs, useBookings...) -> services (api client) -> [MSW mock now | real REST API later]
- Types and Zod schemas live in src/types and src/schemas and mirror the future API.
- Components never import mock data directly.
- When the backend exists: set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
  and `NEXT_PUBLIC_USE_MSW=false` (default). FE runs on port 3001.
- Auth: Bearer access token + single-use refresh via `src/services/api.ts`.
- Clock times from API: minutes since midnight (`src/lib/time.ts`).

## Stack
Next.js App Router + TS strict, Tailwind, shadcn/ui (Radix) + lucide-react, React Hook Form + Zod,
TanStack Query, MSW, Zustand, next-intl (fr default, ar + RTL ready), Recharts, date-fns (Africa/Tunis),
qrcode.react, Framer Motion, Vitest + Testing Library, Playwright, ESLint, Prettier, Husky.

## Folder structure
src/
  app/[locale]/
    (public)/   page.tsx (landing), clubs/[city], club/[slug], coach/[slug], events, event/[slug], tournaments
    (auth)/     login, register, verify-otp, forgot-password
    (player)/   home, clubs, book/[clubSlug], bookings, open-matches (+ new, [id]), results/[matchId],
                ranking, events (+ [id] live Americano/Mexicano), tournaments/[id], coaches, wallet,
                notifications, sanctions, profile, settings
    (club)/club-dashboard/   overview, courts, calendar, events, players, offers
    (coach)/coach-space/     profile, availability, requests, clients
    (admin)/admin/           overview, finance, users, clubs, coaches, events, payments, sponsors,
                             ads, promotions, complaints, settings
    (sponsor)/sponsor/       campaigns, assets
  components/
    ui/        shadcn primitives
    shared/    LevelBadge, StatusBadge, SlotGrid, PlayerAvatar, PlayerSlots, StatCard, DataTable, EmptyState
    layout/    PlayerShell (bottom nav on mobile), DashboardShell (sidebar), Header, Footer
    features/  booking, open-match, results, events, tournament, wallet, coach, admin
  hooks/       useClubs, useBooking, useRanking ... (TanStack Query)
  services/    api client + one file per domain
  mocks/       browser.ts, handlers/, db.ts (in-memory + localStorage), seed/
  types/       Club, Court, Booking, Player, Level, Match, Event ...
  schemas/     Zod schemas
  stores/      Zustand: session/role, bookingDraft
  lib/         utils, format (TND, dates), rbac.ts, constants.ts (levels P25..P1000), draw/, rating/, refund/
  messages/    fr.json, ar.json
tests/e2e/

## Behaviors to simulate later in mocks
- No double booking: POST /bookings returns 409 if slot taken, UI shows "créneau déjà pris" (dev toggle to simulate).
- 10-minute slot hold countdown in payment step.
- Payments: card (mock) success/failed/pending, or pay on site.
- Cancellation: pure computeRefund(startAt, rules) (>24h full, 12-24h partial, <6h none).
- Sanctions: player status normal/watch/suspended/blocked, banner blocks booking when suspended.
- Open Match: 1/4 -> 4/4 then "Match confirmé".
- Result validation: score entry -> others confirm -> official -> rating update (pure computeRating(config)).
- Americano/Mexicano/brackets: pure seeded generators in lib/draw with unit tests (brackets for 8/16/32/64).
- Dev role switcher (Player/Club/Coach/Admin/Sponsor).
- Share links: copy link + WhatsApp share (wa.me).

## UI rules
Mobile-first for player area, sidebar layout for dashboards. All text via next-intl, rtl: variants.
Money in TND (Intl.NumberFormat fr-TN). Loading/empty/error states everywhere. Accessible (focus, labels, contrast, keyboard).
