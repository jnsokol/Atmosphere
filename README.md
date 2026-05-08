# Atmosphere

A correlation-based mood tracker that uncovers hidden links between your emotional state and your environment — weather, location, and music.

Unlike standard mood journals, Atmosphere acts as a personal data scientist: every manual entry is silently enriched with weather data (OpenWeatherMap) and listening history (Spotify), then surfaced through a correlation dashboard that answers questions like *"Does low barometric pressure correlate with my anxiety?"*

## Documentation

- [ROADMAP.md](ROADMAP.md) — 6-milestone development plan
- [ARCHITECTURE.md](ARCHITECTURE.md) — tech stack, schema, API strategy
- [CLAUDE.md](CLAUDE.md) — guidance for Claude Code sessions
- [AGENTS.md](AGENTS.md) — guidance for AI coding agents

## Stack at a glance

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase (Postgres, Auth, RLS, Edge Functions)
- **Charts:** Recharts
- **External APIs:** OpenWeatherMap, Spotify Web API (OAuth2 PKCE)

## Quickstart

```bash
cp .env.example .env.local       # fill in keys
npm install
npx supabase db reset            # apply migrations to local DB
npm run dev
```
