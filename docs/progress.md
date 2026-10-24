# Progress

Frontend wired to NestJS `/api/v1` (see `docs/frontend-api-guide.md`). MSW covers the same paths when `NEXT_PUBLIC_USE_MSW=true`.

| Area | Route | Status |
| --- | --- | --- |
| Public | `/` (landing) | done |
| Public | `/clubs/[city]` | done |
| Public | `/club/[slug]` | done |
| Public | `/coach/[slug]` | done |
| Public | `/events` | done |
| Public | `/event/[slug]` | done |
| Public | `/tournaments` | done |
| Auth | `/login` | done |
| Auth | `/register` | done |
| Auth | `/verify-otp` | done |
| Auth | `/forgot-password` | done |
| Player | `/player/home` | done |
| Player | `/player/clubs` | done |
| Player | `/player/book/[clubSlug]` | done |
| Player | `/player/bookings` | done |
| Player | `/player/open-matches` | done |
| Player | `/player/open-matches/new` | done |
| Player | `/player/open-matches/[id]` | done |
| Player | `/player/results/[matchId]` | done |
| Player | `/player/ranking` | done |
| Player | `/player/events` | done |
| Player | `/player/events/[id]` | done |
| Player | `/player/coaches` | done |
| Player | `/player/wallet` | done |
| Player | `/player/notifications` | done |
| Player | `/player/sanctions` | done |
| Player | `/player/profile` | done |
| Club | `/club-dashboard/overview` | done |
| Club | `/club-dashboard/courts` | done |
| Club | `/club-dashboard/calendar` | done |
| Club | `/club-dashboard/events` | done |
| Club | `/club-dashboard/players` | done |
| Club | `/club-dashboard/offers` | done |
| Coach | `/coach-space/profile` | done |
| Coach | `/coach-space/availability` | done |
| Coach | `/coach-space/requests` | done |
| Coach | `/coach-space/clients` | done |
| Admin | `/admin/overview` | done |
| Admin | `/admin/finance` | done |
| Admin | `/admin/users` | done |
| Admin | `/admin/clubs` | done |
| Admin | `/admin/coaches` | done |
| Admin | `/admin/events` | done |
| Admin | `/admin/payments` | done |
| Admin | `/admin/sponsors` | done |
| Admin | `/admin/ads` | done |
| Admin | `/admin/promotions` | done |
| Admin | `/admin/complaints` | done |
| Admin | `/admin/settings` | done |

## Nest wiring phases

- Phase 0–4: api client, auth/me, public marketplace, bookings/pay/wallet, play (open-match/events/coach/subscriptions)
- Phase 5: club dashboard (`/my/clubs`, courts, bookings check-in/no-show, events, promotions)
- Phase 6: coach space (`/me/coach/*` profile, availabilities, accept/refuse/complete, assessments)
- Phase 7: admin (`/admin/*` stats, clubs, coaches, appeals, settings, promotions, sponsors, ads)
- Phase 8: docs + typecheck/test
