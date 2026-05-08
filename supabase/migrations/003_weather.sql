-- M3: 1:1 weather snapshot per entry.
create table public.weather_snapshots (
  entry_id        uuid primary key references public.mood_entries (id) on delete cascade,
  temp_c          numeric(5,2),
  humidity        smallint,
  pressure_hpa    numeric(6,2),
  condition       text,
  cloud_cover_pct smallint,
  fetched_at      timestamptz not null default now()
);

alter table public.weather_snapshots enable row level security;

-- Snapshot is readable iff the underlying entry is readable.
create policy "owner can read snapshot"
  on public.weather_snapshots for select
  using (
    exists (
      select 1 from public.mood_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

create policy "owner can insert snapshot"
  on public.weather_snapshots for insert
  with check (
    exists (
      select 1 from public.mood_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

-- Cache table for OWM lookups (server-side only; no RLS, never exposed to PostgREST).
create table public.weather_cache (
  lat_round   numeric(4,2) not null,
  lon_round   numeric(5,2) not null,
  hour_bucket timestamptz not null,
  payload     jsonb not null,
  primary key (lat_round, lon_round, hour_bucket)
);

revoke all on public.weather_cache from anon, authenticated;
