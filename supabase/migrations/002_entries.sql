-- M2: mood entries.
create table public.mood_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  mood        smallint not null check (mood between 1 and 10),
  energy      smallint not null check (energy between 1 and 10),
  reflection  text,
  latitude    double precision,
  longitude   double precision,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index mood_entries_user_created_idx
  on public.mood_entries (user_id, created_at desc);

create trigger mood_entries_set_updated_at
before update on public.mood_entries
for each row execute function public.set_updated_at();

alter table public.mood_entries enable row level security;

create policy "owner can read"
  on public.mood_entries for select
  using (user_id = auth.uid());

create policy "owner can insert"
  on public.mood_entries for insert
  with check (user_id = auth.uid());

create policy "owner can update"
  on public.mood_entries for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "owner can delete"
  on public.mood_entries for delete
  using (user_id = auth.uid());
