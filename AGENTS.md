# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Aider, Codex, etc.) working on Atmosphere.

## Read first

1. [ARCHITECTURE.md](ARCHITECTURE.md) — schema, API strategy, project layout.
2. [ROADMAP.md](ROADMAP.md) — current milestone defines what's in scope.
3. [CLAUDE.md](CLAUDE.md) — repo conventions.

Don't propose work outside the current milestone unless the user explicitly asks.

## Operating principles

- **Small, reviewable diffs.** One concern per PR. If a task grows, stop and ask before continuing.
- **Migrations are append-only.** Never edit a committed `supabase/migrations/*.sql` file — add a new one.
- **RLS is non-negotiable.** Every user-owned table needs a policy in the same migration. If you can't write the policy, don't write the table.
- **Server-only secrets stay server-only.** OpenWeatherMap key, Spotify client secret, and the Supabase service-role key must never appear in a file that runs in the browser. Audit imports before committing.
- **Failures in third-party APIs must not block the user.** A weather fetch error saves the entry with `weather_snapshots = null` and logs the error.
- **Don't add ML, prediction, or AI features in v1.** The correlation engine is rule-based and statistical (Pearson, grouped means). v2 territory is off-limits until v1 ships.

## Code style

- TypeScript strict mode. No `any` without a `// eslint-disable-next-line` and a one-line reason.
- Use Zod to validate every Server Action input and every external API response shape.
- Keep components under ~150 lines. Extract helpers to `lib/` once a function is reused twice.
- Tailwind utility classes inline; extract to a component before reaching for `@apply`.

## Commit / PR hygiene

- Reference the milestone in the commit subject: `M3: cache OWM lookups for 30 min`.
- PR description states: what changed, why, and how to test locally.
- Run `npm run typecheck`, `npm run lint`, and `npm run test` before opening a PR.

## Definition of Done

A task is done when:

1. Types check, lint passes, tests pass.
2. The happy path works in `npm run dev`.
3. New tables have RLS verified by a test as a different user.
4. No new TODOs without an issue link.
