# TODO

Full details for each milestone are in [ROADMAP.md](ROADMAP.md).

---

## Milestone 1 — Foundation & Auth (Week 1)

- [ ] Initialize Next.js 15 (App Router, TypeScript, Tailwind)
- [ ] Configure Supabase project; wire up `@supabase/ssr` for server-side auth
- [ ] Email/password auth + magic link
- [ ] Protected `/app` route group; redirect unauthenticated users to `/login`
- [ ] Base layout: top nav, auth state, sign-out
- [ ] Apply migration `001_init.sql`

---

## Milestone 2 — Manual Mood Logging (Week 2)

- [ ] Migration `002_entries.sql`: `mood_entries` table + RLS policies
- [ ] `/app/log` page: mood slider (1–10), energy slider (1–10), text reflection
- [ ] `/app/history` page: chronological feed, filter by date range and mood
- [ ] Entry detail view (`/app/entries/[id]`) with edit/delete
- [ ] Server Actions for mutations; React Query for cache

---

## Milestone 3 — Weather Enrichment (Week 3)

- [ ] Browser geolocation prompt on `/app/log`; manual city picker fallback
- [ ] `saveEntry` calls OpenWeatherMap on every save
- [ ] Migration `003_weather.sql`: `weather_snapshots` table linked 1:1 to entries
- [ ] Cache identical (lat, lon, hour) lookups for 30 minutes
- [ ] Show captured weather as a chip on the history feed

---

## Milestone 4 — Spotify OAuth & Listening History (Week 4)

- [ ] Spotify OAuth2 PKCE flow; scope: `user-read-recently-played`
- [ ] Store tokens in `spotify_accounts` (refresh token via Supabase Vault)
- [ ] Fetch recently played tracks on entry save
- [ ] Migration `004_music.sql`: `tracks` catalog + `track_plays` per entry
- [ ] Edge Function to backfill audio features (tempo, valence, energy)

---

## Milestone 5 — Correlation Engine & Dashboard (Week 5)

- [ ] `/app/insights` page with 4 Recharts charts (scatter + bar)
- [ ] Pearson correlation computed server-side via Supabase RPC
- [ ] Rule-based Insights Generator (min sample size n ≥ 10)
- [ ] Mood vs. cloud cover, pressure, weekday, and track valence

---

## Milestone 6 — Polish, PWA & Deploy (Week 6)

- [ ] Loading skeletons, empty states, error boundaries
- [ ] PWA manifest + offline log form with sync-on-reconnect
- [ ] E2E tests (Playwright): signup → log → weather → dashboard
- [ ] Deploy to Vercel; promote Supabase to production tier
- [ ] Privacy page with data export and account deletion
