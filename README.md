> **© 2026 Jan Sokołowski. All rights reserved.**
> Copying, redistribution, or use of this code in whole or in part without explicit written permission from the author is strictly prohibited.

# Atmosphere

A mood tracker that automatically enriches every entry with weather data and surfaces correlations between your emotional state and your environment.

## What it does

- **Log your mood & energy** — tap a 1–10 scale, add an optional reflection
- **Automatic weather capture** — every entry is silently tagged with real-time temperature, conditions, humidity, pressure, and cloud cover from OpenWeatherMap
- **Insights dashboard** — charts and auto-generated text insights (mood over time, by weekday, vs. air pressure, vs. cloud cover)
- **Gamification** — XP system, 10 levels, 20 achievements
- **Profile** — avatar, display name, bio, stats, streaks
- **Installable PWA** — works on iOS, Android, and desktop as a standalone app

## Stack

- **Frontend:** Next.js 15 (App Router) · JavaScript · Tailwind CSS
- **Backend:** Supabase (Postgres · Auth · RLS · Storage)
- **Charts:** Recharts
- **Weather:** OpenWeatherMap API
- **Hosting:** Vercel

## Local development

```bash
# 1. Clone and install
git clone https://github.com/jnsokol/Atmosphere.git
cd Atmosphere
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, OPENWEATHER_API_KEY

# 3. Apply database migrations (Supabase dashboard → SQL Editor)
# Run each file in supabase/migrations/ in order

# 4. Start dev server
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |

## Project structure

```
src/
  app/
    (app)/          # Authenticated routes (dashboard, log, history, insights, profile)
    login/          # Auth page (sign in, sign up, magic link)
    api/            # Upload and export endpoints
  components/       # Shared UI components
  lib/              # Supabase clients, gamification, insights, weather
  server/actions/   # Server Actions (auth, entries, profile)
supabase/
  migrations/       # SQL migrations with RLS policies
```

## Installing as an app

**iOS:** Open in Safari → Share → Add to Home Screen

**Android:** Open in Chrome → menu (⋮) → Add to Home Screen

**Desktop:** Open in Chrome/Edge → address bar install icon → Install
