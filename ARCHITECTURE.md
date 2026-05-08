# Architecture

## 1. Tech Stack

| Layer            | Choice                                  | Why                                                                    |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| Framework        | **Next.js 15** (App Router, TS)         | Server Actions remove most API boilerplate; SSR for the dashboard.     |
| UI               | **Tailwind CSS** + **shadcn/ui**        | Owned components, no runtime cost.                                     |
| State / data     | **TanStack Query** + Server Actions     | Optimistic mutations, cache for the history feed.                      |
| Backend          | **Supabase** (Postgres, Auth, Storage)  | Postgres + RLS gets us auth, multi-tenancy, and SQL for free.          |
| Edge logic       | **Supabase Edge Functions** (Deno)      | OAuth callbacks and scheduled jobs (audio-feature backfill).           |
| Charts           | **Recharts**                            | Composable, declarative, great defaults. (D3 only if Recharts caps us.) |
| External APIs    | OpenWeatherMap, Spotify Web API         | Free tiers cover personal use.                                         |
| Hosting          | Vercel (web) + Supabase Cloud (DB)      | Zero-config deploy, generous free tiers.                               |

> **Web vs. native:** v1 ships as a responsive PWA. A React Native shell (Expo) is a v2 option once correlations prove valuable — the Supabase backend stays unchanged.

---

## 2. Database Schema

All user-owned tables enforce **RLS**: `user_id = auth.uid()`.

```
auth.users  (managed by Supabase)
   │
   ├── mood_entries
   │     id, user_id, mood (1-10), energy (1-10), reflection (text),
   │     latitude, longitude, created_at
   │
   ├── weather_snapshots          (1:1 with mood_entries)
   │     entry_id PK/FK, temp_c, humidity, pressure_hpa,
   │     condition (text), cloud_cover_pct, fetched_at
   │
   ├── spotify_accounts           (1:1 with user)
   │     user_id PK/FK, access_token (vault), refresh_token (vault),
   │     scope, expires_at
   │
   ├── track_plays                (N per entry)
   │     id, entry_id FK, track_id FK, played_at
   │
   └── tracks                     (deduped, shared across users)
         id (= spotify track id), name, artist, album,
         duration_ms, tempo_bpm, valence, energy, loaded_at
```

### Why this shape

- **`weather_snapshots` is a separate table, not columns on `mood_entries`** — keeps the entry row narrow when we add air-quality / pollen later, and allows nullable enrichment without polluting NOT NULL constraints.
- **`tracks` is global**, deduped by Spotify track id — audio features only need to be fetched once across the whole user base.
- **`track_plays` is the join** — many tracks per entry, per-user.

### Key indexes

- `mood_entries (user_id, created_at DESC)` — history feed.
- `track_plays (entry_id)` — entry detail page.
- `tracks (loaded_at)` partial index where `tempo_bpm IS NULL` — backfill worker.

---

## 3. API Strategy

### OpenWeatherMap

- **Endpoint:** `GET /data/2.5/weather?lat&lon&appid&units=metric`
- **Auth:** API key (server-side only). Never exposed to the browser.
- **Where:** called inside the `saveEntry` Server Action, after the mood row is inserted but before the transaction commits — if the API fails, the entry still saves with `weather_snapshots = null`. Don't block the user on a flaky third party.
- **Caching:** Redis-free approach — a `weather_cache (lat_round, lon_round, hour_bucket) → snapshot` Postgres table with a 30-minute TTL. Two entries logged in the same hour from the same neighbourhood share a fetch.

### Spotify (OAuth2 Authorization Code + PKCE)

PKCE is required because the auth callback runs in the browser context.

```
1. User clicks "Connect Spotify" → /api/spotify/login
   Server generates code_verifier (stored httpOnly cookie) +
   code_challenge → redirects to accounts.spotify.com/authorize
   with scope=user-read-recently-played

2. Spotify redirects to /api/spotify/callback?code=...
   Server exchanges code + verifier for access_token + refresh_token
   Stores both in spotify_accounts (refresh_token via Supabase Vault)

3. On entry save, server-side helper getSpotifyClient(userId):
   - reads token row
   - if expires_at < now() + 60s → POST /api/token with refresh_token
   - returns a fetch wrapper

4. Daily Edge Function backfills tempo/valence for tracks where
   tempo_bpm IS NULL via /v1/audio-features?ids=<batch of 100>
```

**Token storage:** Supabase Vault encrypts at rest. Never send refresh tokens to the client.

---

## 4. Correlation Engine

Run analyses **server-side**, not in the browser — keeps the dashboard fast and the math testable.

- Pearson `r` between numeric pairs (mood↔pressure, mood↔valence, etc.) computed in a Postgres function `compute_user_correlations(uid uuid)`.
- Categorical splits (sunny vs. cloudy, weekday vs. weekend) computed via grouped averages with sample-size gates.
- Results cached in `user_insights` and recomputed nightly — recompute on-demand if the user's entry count crosses a power-of-2 threshold (10, 20, 40, …).

### Insight Generator (rule-based, v1)

```ts
if (sunny.mean - cloudy.mean > 1 && sunny.n >= 7 && cloudy.n >= 7) {
  emit(`Your mood averages ${pct}% higher on sunny days.`)
}
if (pearson(mood, pressure) < -0.3 && n >= 20) {
  emit(`Lower pressure correlates with lower mood (r=${r.toFixed(2)}).`)
}
```

No ML in v1. Anything fancier waits for v2.

---

## 5. Data Visualization

**Recharts** is the default. Pick a chart per question:

| Question                          | Chart                       |
| --------------------------------- | --------------------------- |
| Mood vs. continuous variable      | `ScatterChart` + trendline  |
| Mood by category (weather, day)   | `BarChart`                  |
| Mood over time                    | `LineChart` (7-day rolling) |
| Distribution of mood scores       | `Histogram` (custom Bar)    |

Reach for **D3** only if Recharts can't express something (custom small-multiples, calendar heatmaps).

---

## 6. Project Structure

```
.
├── README.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── AGENTS.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_init.sql
│   │   ├── 002_entries.sql
│   │   ├── 003_weather.sql
│   │   └── 004_music.sql
│   └── functions/
│       └── spotify-backfill/index.ts
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                  (marketing landing)
    │   ├── login/page.tsx
    │   ├── (app)/                    (auth-gated group)
    │   │   ├── layout.tsx
    │   │   ├── log/page.tsx
    │   │   ├── history/page.tsx
    │   │   ├── entries/[id]/page.tsx
    │   │   └── insights/page.tsx
    │   └── api/
    │       └── spotify/
    │           ├── login/route.ts
    │           └── callback/route.ts
    ├── components/
    │   ├── ui/                       (shadcn primitives)
    │   ├── mood-form.tsx
    │   ├── entry-card.tsx
    │   └── charts/
    ├── lib/
    │   ├── supabase/
    │   │   ├── server.ts
    │   │   └── client.ts
    │   ├── weather.ts                (OpenWeatherMap client)
    │   ├── spotify.ts                (token mgmt + fetch wrapper)
    │   └── correlation.ts            (stats helpers)
    ├── server/
    │   └── actions/
    │       ├── save-entry.ts
    │       └── delete-entry.ts
    └── types/
        └── db.ts                     (generated from Supabase)
```

---

## 7. Security Notes

- **RLS on every user-owned table.** No exceptions. Confirm with `SELECT * FROM mood_entries` as a different user before merging any migration.
- **Server-only secrets:** OpenWeatherMap key, Spotify client secret, service-role Supabase key. Never importable from `'use client'` files.
- **Geolocation is opt-in** with clear copy. Manual city fallback for users who decline.
- **Data export & delete** must work — privacy page wires up `/api/export` (returns JSON) and account deletion via Supabase admin API.
