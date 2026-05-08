-- M4: Spotify accounts, deduped tracks, and per-entry plays.

create table public.spotify_accounts (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  access_token   text not null,
  refresh_token  text not null,
  scope          text,
  expires_at     timestamptz not null,
  updated_at     timestamptz not null default now()
);

create trigger spotify_accounts_set_updated_at
before update on public.spotify_accounts
for each row execute function public.set_updated_at();

alter table public.spotify_accounts enable row level security;

create policy "owner can read tokens"
  on public.spotify_accounts for select
  using (user_id = auth.uid());

-- Inserts/updates happen with the service role from the OAuth callback only.
-- No insert/update/delete policy for end-users on purpose.

-- Global, deduped track catalog.
create table public.tracks (
  id           text primary key,        -- spotify track id
  name         text not null,
  artist       text not null,
  album        text,
  duration_ms  integer,
  tempo_bpm    numeric(5,2),
  valence      numeric(4,3),
  energy       numeric(4,3),
  loaded_at    timestamptz not null default now()
);

create index tracks_audio_features_pending_idx
  on public.tracks (loaded_at)
  where tempo_bpm is null;

alter table public.tracks enable row level security;
create policy "tracks are readable by any authenticated user"
  on public.tracks for select
  to authenticated
  using (true);

-- Per-entry plays.
create table public.track_plays (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid not null references public.mood_entries (id) on delete cascade,
  track_id   text not null references public.tracks (id),
  played_at  timestamptz not null
);

create index track_plays_entry_idx on public.track_plays (entry_id);

alter table public.track_plays enable row level security;

create policy "owner can read plays"
  on public.track_plays for select
  using (
    exists (
      select 1 from public.mood_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

create policy "owner can insert plays"
  on public.track_plays for insert
  with check (
    exists (
      select 1 from public.mood_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );
