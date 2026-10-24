# Project: Padel Platform — FRONTEND ONLY (Tunisia)

## Stack
Next.js (App Router), TypeScript strict, Tailwind, shadcn/ui, TanStack Query,
React Hook Form + Zod, Zustand, next-intl (fr default, ar/RTL-ready), MSW for mocks,
Recharts, date-fns, Vitest, Playwright.

## Scope
Front-end only. NO real backend, database or payment. All data comes from MSW mocks
behind services/ and hooks/. Types and Zod schemas must mirror a realistic REST API
so the backend can be plugged in later by changing the API base URL.

## Source of truth
- Features: docs/cahier-des-charges.* (French)
- UI: docs/brief-uiux.md and docs/design/* (match the screenshots when they exist)
- Structure: docs/frontend-architecture.md
Ambiguity -> ask, or write the assumption in docs/decisions.md. Do not invent features.

## Rules
1. TypeScript strict, no `any`.
2. Components never import mock data. Use hooks -> services -> MSW.
3. Validate forms with Zod + React Hook Form.
4. All UI text via next-intl (messages/fr.json). No hardcoded strings.
5. Mobile-first Tailwind, dark/light, rtl: variants. Use design tokens, no random colors.
6. Every data view has loading, empty and error states.
7. Business rules (refund, rating, draw, brackets) are pure functions in src/lib with unit tests.
8. Reuse components from components/ui and components/shared before creating new ones.
9. Keep components small (<200 lines), one responsibility.
10. Before finishing: run `pnpm lint && pnpm typecheck && pnpm test`, then report.

## Workflow
One screen/module per task. Propose a short plan first, then implement.
End with: what was done, how to test (URL/route), what remains.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
