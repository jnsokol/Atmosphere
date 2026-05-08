# CLAUDE.md

Guidance for Claude Code working in this repo.

## Before everything

Read [AGENTS.md](../AGENTS.md) before taking any action, every single session without exception.

## Project

Atmosphere is a correlation-based mood tracker. See [README.md](README.md), [ROADMAP.md](ROADMAP.md), and [ARCHITECTURE.md](ARCHITECTURE.md) before making non-trivial changes.

## Stack

Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui. Supabase for auth, Postgres, and Edge Functions. Recharts for visualization.

## Conventions

- **Server Actions over API routes** for mutations. Reserve `app/api/*` for OAuth callbacks and webhooks.
- **`'use client'` only when needed** (forms, charts, geolocation). Default to Server Components.
- **Database access through `lib/supabase/server.ts`** in server contexts; client-side Supabase only for auth state subscription.
- **All user-owned tables have RLS.** When adding a migration, write the policy in the same file — no exceptions.
- **External API calls are server-only.** Never import `lib/weather.ts` or `lib/spotify.ts` from a `'use client'` module.
- **Path alias:** `@/*` → `src/*`.

## Migrations

Stored in `supabase/migrations/NNN_name.sql`. Numbers are sequential. Always include the corresponding RLS policies and indexes in the same file. Apply locally with `npx supabase db reset`.

## Testing

- Unit: Vitest, colocated as `*.test.ts` next to source.
- E2E: Playwright in `tests/e2e/`.
- Run `npm run typecheck && npm run test` before claiming a task is done.

## What to ask before doing

- Adding a new external API or third-party SDK.
- Changing the database schema in a way that drops columns.
- Anything that touches `spotify_accounts` (token handling is security-sensitive).

## What you can do without asking

- Add components, routes, server actions, and tests.
- Refactor within a file.
- Update copy, styling, and chart configuration.
