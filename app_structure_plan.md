# App Directory Structure — Full Plan

## Context
The Padel project has the scaffolding (i18n, mocks, stores, types, lib) but no `src/app/` directory.
We need to create the entire routing structure with placeholder pages.

## Key Decision: URL Conflict Resolution
Route groups `(public)` and `(player)` would clash on `/events`, `/tournaments`, etc.
**Fix:** Player pages go under a real `/player/` segment: `(player)/player/...`

This is consistent with how `(club)/club-dashboard/...`, `(coach)/coach-space/...`,
`(admin)/admin/...`, and `(sponsor)/sponsor/...` already use real segments.

---

## Final Route Map

### Public `(public)/` — no URL prefix
| URL | File |
|---|---|
| `/` | `(public)/page.tsx` (landing) |
| `/clubs/[city]` | `(public)/clubs/[city]/page.tsx` |
| `/club/[slug]` | `(public)/club/[slug]/page.tsx` |
| `/coach/[slug]` | `(public)/coach/[slug]/page.tsx` |
| `/events` | `(public)/events/page.tsx` |
| `/event/[slug]` | `(public)/event/[slug]/page.tsx` |
| `/tournaments` | `(public)/tournaments/page.tsx` |

### Auth `(auth)/` — no URL prefix
| URL | File |
|---|---|
| `/login` | `(auth)/login/page.tsx` |
| `/register` | `(auth)/register/page.tsx` |
| `/verify-otp` | `(auth)/verify-otp/page.tsx` |
| `/forgot-password` | `(auth)/forgot-password/page.tsx` |

### Player `(player)/player/` — URL prefix `/player`
| URL | File |
|---|---|
| `/player/home` | `(player)/player/home/page.tsx` |
| `/player/clubs` | `(player)/player/clubs/page.tsx` |
| `/player/book/[clubSlug]` | `(player)/player/book/[clubSlug]/page.tsx` |
| `/player/bookings` | `(player)/player/bookings/page.tsx` |
| `/player/open-matches` | `(player)/player/open-matches/page.tsx` |
| `/player/open-matches/new` | `(player)/player/open-matches/new/page.tsx` |
| `/player/open-matches/[id]` | `(player)/player/open-matches/[id]/page.tsx` |
| `/player/results/[matchId]` | `(player)/player/results/[matchId]/page.tsx` |
| `/player/ranking` | `(player)/player/ranking/page.tsx` |
| `/player/events` | `(player)/player/events/page.tsx` |
| `/player/events/[id]` | `(player)/player/events/[id]/page.tsx` |
| `/player/tournaments/[id]` | `(player)/player/tournaments/[id]/page.tsx` |
| `/player/coaches` | `(player)/player/coaches/page.tsx` |
| `/player/wallet` | `(player)/player/wallet/page.tsx` |
| `/player/notifications` | `(player)/player/notifications/page.tsx` |
| `/player/sanctions` | `(player)/player/sanctions/page.tsx` |
| `/player/profile` | `(player)/player/profile/page.tsx` |
| `/player/settings` | `(player)/player/settings/page.tsx` |

### Club `(club)/club-dashboard/` — URL prefix `/club-dashboard`
| URL | File |
|---|---|
| `/club-dashboard/overview` | `(club)/club-dashboard/overview/page.tsx` |
| `/club-dashboard/courts` | `(club)/club-dashboard/courts/page.tsx` |
| `/club-dashboard/calendar` | `(club)/club-dashboard/calendar/page.tsx` |
| `/club-dashboard/events` | `(club)/club-dashboard/events/page.tsx` |
| `/club-dashboard/players` | `(club)/club-dashboard/players/page.tsx` |
| `/club-dashboard/offers` | `(club)/club-dashboard/offers/page.tsx` |

### Coach `(coach)/coach-space/` — URL prefix `/coach-space`
| URL | File |
|---|---|
| `/coach-space/profile` | `(coach)/coach-space/profile/page.tsx` |
| `/coach-space/availability` | `(coach)/coach-space/availability/page.tsx` |
| `/coach-space/requests` | `(coach)/coach-space/requests/page.tsx` |
| `/coach-space/clients` | `(coach)/coach-space/clients/page.tsx` |

### Admin `(admin)/admin/` — URL prefix `/admin`
| URL | File |
|---|---|
| `/admin/overview` | `(admin)/admin/overview/page.tsx` |
| `/admin/finance` | `(admin)/admin/finance/page.tsx` |
| `/admin/users` | `(admin)/admin/users/page.tsx` |
| `/admin/clubs` | `(admin)/admin/clubs/page.tsx` |
| `/admin/coaches` | `(admin)/admin/coaches/page.tsx` |
| `/admin/events` | `(admin)/admin/events/page.tsx` |
| `/admin/payments` | `(admin)/admin/payments/page.tsx` |
| `/admin/sponsors` | `(admin)/admin/sponsors/page.tsx` |
| `/admin/ads` | `(admin)/admin/ads/page.tsx` |
| `/admin/promotions` | `(admin)/admin/promotions/page.tsx` |
| `/admin/complaints` | `(admin)/admin/complaints/page.tsx` |
| `/admin/settings` | `(admin)/admin/settings/page.tsx` |

### Sponsor `(sponsor)/sponsor/` — URL prefix `/sponsor`
| URL | File |
|---|---|
| `/sponsor/campaigns` | `(sponsor)/sponsor/campaigns/page.tsx` |
| `/sponsor/assets` | `(sponsor)/sponsor/assets/page.tsx` |

---

## Files to Create

### 1. Infrastructure
| # | File | Purpose |
|---|---|---|
| 1 | `src/middleware.ts` | next-intl middleware (redirect `/` → `/fr`, locale prefix) |
| 2 | `src/messages/fr.json` | French translations (all page names + nav) |
| 3 | `src/messages/ar.json` | Arabic translations (stub, same keys) |
| 4 | `src/app/globals.css` | Global styles (Tailwind directives + CSS vars) |

### 2. Root App Files
| # | File | Purpose |
|---|---|---|
| 5 | `src/app/[locale]/layout.tsx` | Root layout: html dir/lang, body, NextIntlProvider, QueryClientProvider, ThemeProvider, Toaster, MSW init (dev), dev RoleSwitcher |
| 6 | `src/app/[locale]/not-found.tsx` | 404 page |
| 7 | `src/app/[locale]/loading.tsx` | Root loading spinner |
| 8 | `src/app/[locale]/error.tsx` | Root error boundary |

### 3. Layout Components
| # | File | Purpose |
|---|---|---|
| 9 | `src/components/layout/PlayerShell.tsx` | Bottom nav mobile shell for player routes |
| 10 | `src/components/layout/DashboardShell.tsx` | Sidebar layout for club/coach/admin/sponsor |
| 11 | `src/components/layout/Header.tsx` | Public header |
| 12 | `src/components/layout/Footer.tsx` | Public footer |

### 4. Providers
| # | File | Purpose |
|---|---|---|
| 13 | `src/components/providers/QueryProvider.tsx` | TanStack Query client provider (client component) |
| 14 | `src/components/providers/ThemeProvider.tsx` | next-themes wrapper |
| 15 | `src/components/providers/MswProvider.tsx` | MSW starter (dev only, client component) |
| 16 | `src/components/providers/DevRoleSwitcher.tsx` | Floating role switcher (dev only) |

### 5. Route Group Layouts
| # | File | Purpose |
|---|---|---|
| 17 | `src/app/[locale]/(public)/layout.tsx` | Header + Footer wrapper |
| 18 | `src/app/[locale]/(auth)/layout.tsx` | Centered auth layout |
| 19 | `src/app/[locale]/(player)/layout.tsx` | PlayerShell wrapper |
| 20 | `src/app/[locale]/(club)/layout.tsx` | DashboardShell (club nav) |
| 21 | `src/app/[locale]/(coach)/layout.tsx` | DashboardShell (coach nav) |
| 22 | `src/app/[locale]/(admin)/layout.tsx` | DashboardShell (admin nav) |
| 23 | `src/app/[locale]/(sponsor)/layout.tsx` | DashboardShell (sponsor nav) |

### 6. Placeholder Pages
~53 `page.tsx` files, each showing a translated page name via `useTranslations`.

### 7. Dev Landing Page
The `(public)/page.tsx` (at `/fr`) will list all routes grouped by area with clickable links.

### 8. Doc Updates
- `docs/frontend-architecture.md` — update route map with `/player/` prefix
- `docs/progress.md` — update route table with `/player/` URLs
- `docs/decisions.md` — record the URL conflict resolution decision

---

## Implementation Order
1. Create `src/messages/fr.json` and `src/messages/ar.json`
2. Create `src/middleware.ts` (move logic from `src/proxy.ts`)
3. Create `src/app/globals.css`
4. Create provider components (QueryProvider, ThemeProvider, MswProvider, DevRoleSwitcher)
5. Create layout components (PlayerShell, DashboardShell, Header, Footer)
6. Create `src/app/[locale]/layout.tsx` + error/loading/not-found
7. Create route group layouts
8. Create all placeholder pages
9. Create dev landing page
10. Update docs
11. Run `pnpm dev` and verify
12. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
