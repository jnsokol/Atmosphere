# TODO

Full details for each milestone are in [ROADMAP.md](ROADMAP.md).

---

## Milestone 1 — Foundation & Auth (Week 1)

- [x] Initialize Next.js 15 (App Router, JavaScript, Tailwind)
- [x] Configure Supabase project; wire up `@supabase/ssr` for server-side auth
- [x] Email/password auth + magic link
- [x] Protected route group; redirect unauthenticated users to `/login`
- [x] Base layout: top nav, auth state, sign-out
- [ ] Apply migration `001_init.sql` (requires live Supabase project)

---

## Milestone 2 — Manual Mood Logging (Week 2)

- [x] Migration `002_entries.sql`: `mood_entries` table + RLS policies
- [x] `/log` page: mood slider (1–10), energy slider (1–10), text reflection
- [x] `/history` page: chronological feed, filter by date range and mood
- [x] Entry detail view (`/entries/[id]`) with edit/delete
- [x] Server Actions for mutations (saveEntry, updateEntry, deleteEntry)

---

## Milestone 3 — Weather Enrichment (Week 3)

- [x] Browser geolocation prompt on `/log`; graceful fallback if denied
- [x] `saveEntry` calls OpenWeatherMap on every save (non-blocking)
- [x] Migration `003_weather.sql`: `weather_snapshots` table linked 1:1 to entries
- [ ] Cache identical (lat, lon, hour) lookups for 30 minutes (deferred — Next.js fetch revalidate handles basic caching)
- [x] Show captured weather as a chip on the history feed and entry detail

---

## Milestone 4 — Spotify OAuth & Listening History (Week 4)

- [ ] Spotify OAuth2 PKCE flow; scope: `user-read-recently-played`
- [ ] Store tokens in `spotify_accounts` (refresh token via Supabase Vault)
- [ ] Fetch recently played tracks on entry save
- [ ] Migration `004_music.sql`: `tracks` catalog + `track_plays` per entry
- [ ] Edge Function to backfill audio features (tempo, valence, energy)

---

## Milestone 5 — Correlation Engine & Dashboard (Week 5)

- [x] `/insights` page with 4 Recharts charts (line, bar, 2x scatter)
- [x] Pearson correlation computed server-side in lib/insights.js
- [x] Rule-based Insights Generator (min sample size n ≥ 10)
- [x] Mood vs. cloud cover, pressure, weekday, and over time (valence deferred to M4)

---

## Milestone 5.5 — Dashboard, Profile & Gamification

- [x] `/dashboard` — streak, level bar, stats, recent entries, Log CTA
- [x] `/profile` — avatar upload, display name, stats, level, achievements
- [x] Migration `005_profiles.sql` — profiles table + RLS
- [x] `lib/gamification.js` — XP, levels (10), streak, 8 achievements
- [x] Nav updated with Home + Profile links

---

## Milestone 6 — Polish, PWA & Deploy (Week 6)

- [x] Loading skeletons on dashboard, history, insights, profile
- [x] Error boundary (error.jsx) + global not-found page
- [x] PWA manifest + meta tags (add to home screen ready)
- [ ] E2E tests (Playwright): signup → log → weather → dashboard
- [ ] Deploy to Vercel; promote Supabase to production tier
- [x] Privacy page with JSON data export and account deletion
