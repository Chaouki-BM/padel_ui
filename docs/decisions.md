# Decisions

Record assumptions and choices when the cahier des charges or UI brief is ambiguous.

| Date | Topic | Decision | Rationale |
| --- | --- | --- | --- |
| 2026-10-20 | API base URL | `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`; service paths without `/api` prefix | Matches Nest guide; avoids double `/api` |
| 2026-10-20 | FE port | `next dev -p 3001` | API CORS allows localhost:3001 by default |
| 2026-10-20 | MSW | Enabled only when `NEXT_PUBLIC_USE_MSW=true` | Real API is default for integration |
| 2026-10-20 | Auth tokens | Zustand persist + single-flight refresh | Guide: refresh is single-use |
| 2026-10-20 | Clock times | Minutes since midnight in API; `src/lib/time.ts` for HH:mm UI | Guide convention |
| 2026-10-20 | Nest response mapping | Flexible unwrap + mappers to existing UI types | Swagger fields may vary; keep screens stable |
| 2026-10-20 | Coach routes | Path param is coach UUID (`id`); slug field falls back to id | Nest `GET /coaches/:id` |
| 2026-10-20 | MSW offline | Empty `API_URL` + `USE_MSW=true` prefixes `/api/v1` | Legacy `/api/...` dashboard handlers still work |
| 2026-10-20 | Club context | `GET /my/clubs` + Zustand `activeClubId` | Nest club routes are `/clubs/:clubId/...` |
| 2026-10-20 | Club players list | Derived from club bookings (no full PII list) | Guide: behaviour endpoint only per player |
| 2026-10-20 | Coach dashboard | Synthesized from `GET /me/coach/bookings` + profile | Nest has no dedicated coach dashboard DTO |
| 2026-10-20 | Admin complaints UI | Maps to `GET/PATCH /admin/appeals` | Guide appeals = contestations / sanctions ladder |
