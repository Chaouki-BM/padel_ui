# Padel Platform API — Frontend developer guide

Source: backend guide v1.0 (19 October 2026). Live contract: Swagger at `/api/docs`. When this file disagrees with Swagger, **Swagger wins**.

## Run locally

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`
- Mailpit: `http://localhost:8025`
- Frontend (this app): `http://localhost:3001` (CORS default)
- Demo password: `Padel2026!`
- Demo emails: `admin@padel.local`, `manager@club-demo-tunis.local`, `player1@padel.local` … `player10@padel.local`

## Conventions

| Topic | Rule |
| --- | --- |
| Errors | `{ statusCode, error, message, requestId }` — `message` is string[] for validation, string otherwise |
| Money | TND numbers; server computes prices |
| Times of day | Minutes since midnight (480 = 08:00) |
| Timestamps | ISO 8601 **with** timezone; prefer `Z` in query strings |
| Dates | `YYYY-MM-DD` |
| Auth | `Authorization: Bearer <accessToken>` |
| Roles | PLAYER, CLUB, COACH, ADMIN, SPONSOR |

## Auth token handling

Access ~15 min, refresh 30 days **single use**. Store the new refresh token after every refresh; serialise concurrent refreshes behind one promise; send user to login on refresh 401.

## Env (this frontend)

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_USE_MSW=false
```

Service paths are relative to the base URL (e.g. `/auth/login`, `/clubs/:slug`) — no extra `/api` prefix.
