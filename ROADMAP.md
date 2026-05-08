# Roadmap — 6 Milestones

Each milestone is a shippable slice. Don't start the next one until the previous is working end-to-end.

---

## Milestone 1 — Foundation & Auth (Week 1)

**Goal:** A user can sign up, log in, and see an empty dashboard.

- Initialize Next.js 15 (App Router, TypeScript, Tailwind).
- Configure Supabase project; wire up `@supabase/ssr` for server-side auth.
- Email/password auth + magic link.
- Protected `/app` route group; redirect unauthenticated users to `/login`.
- Base layout: top nav, auth state, sign-out.
- Apply migration `001_init.sql` (users handled by `auth.users`).

**Done when:** A new user can sign up and reach an empty `/app` page.

---

## Milestone 2 — Manual Mood Logging (Week 2)

**Goal:** Phase A from the spec — record and browse entries.

- Migration `002_entries.sql`: `mood_entries` table + RLS policies.
- `/app/log` page: form for mood (1–10 slider), energy (1–10), text reflection.
- `/app/history` page: chronological feed, filter by date range and mood threshold.
- Entry detail view (`/app/entries/[id]`) with edit/delete.
- Server Actions for mutations; React Query for cache.

**Done when:** A user can create, list, edit, and delete entries — no enrichment yet.

---

## Milestone 3 — Weather Enrichment (Week 3)

**Goal:** Every saved entry is silently tagged with current weather.

- Browser geolocation prompt on `/app/log`; fall back to a manual city picker.
- Server Action `saveEntry` calls OpenWeatherMap *Current Weather* endpoint with the entry's coordinates.
- Migration `003_weather.sql`: `weather_snapshots` table linked 1:1 to `mood_entries`.
- Cache identical (lat,lon,hour) lookups for 30 minutes to stay under the free tier.
- Show the captured weather as a chip on the history feed.

**Done when:** Saving an entry persists temperature, humidity, pressure, condition, and cloud cover alongside the mood.

---

## Milestone 4 — Spotify OAuth & Listening History (Week 4)

**Goal:** Connect Spotify; capture recently played tracks per entry.

- Spotify OAuth2 (Authorization Code with PKCE). Scopes: `user-read-recently-played`.
- Token storage in `spotify_accounts` table (refresh token encrypted via Supabase Vault).
- On entry save: fetch `/me/player/recently-played?before=<entry_ts>&limit=10`.
- Migration `004_music.sql`: `track_plays` (FK → entry) and `tracks` (deduped catalog of track metadata: tempo, valence, energy from Audio Features).
- Background job (Edge Function) refreshes audio features lazily.

**Done when:** Linked users see the 5 tracks they were listening to around each entry, with tempo/valence captured.

---

## Milestone 5 — Correlation Engine & Dashboard (Week 5)

**Goal:** Phase C — visualize relationships.

- `/app/insights` route with charts (Recharts):
  - Mood vs. cloud cover (scatter)
  - Mood vs. pressure (scatter, with trendline)
  - Mood vs. weekday (bar)
  - Mood vs. average track valence (scatter)
- Compute Pearson correlation server-side (Supabase RPC or Edge Function) over the user's full dataset.
- Insights Generator: rule-based statements
  - *"Your mood averages 20% higher on sunny days (n=14)."*
  - *"Anxiety reflections cluster on days with pressure < 1005 hPa."*
- Require minimum sample size (n ≥ 10) before showing any insight.

**Done when:** Dashboard renders 4 charts and at least 2 generated insight statements.

---

## Milestone 6 — Polish, PWA & Deploy (Week 6)

**Goal:** Production-ready.

- Loading skeletons, empty states, error boundaries.
- PWA manifest + offline shell for the log form (queue entries while offline; sync on reconnect).
- E2E tests (Playwright) covering: signup → log entry → see weather → view dashboard.
- Deploy to Vercel; Supabase project promoted to production tier.
- Privacy page explaining what's stored and how to export/delete.

**Done when:** A friend can use the deployed URL on their phone and the dashboard works after a week of logging.

---

## Out of scope for v1

- Push notifications / reminders
- Multi-device sync conflicts beyond last-write-wins
- Sharing entries between users
- ML-based mood prediction (future v2)
