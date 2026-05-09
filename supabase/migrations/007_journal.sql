-- M7: notebooks and journal entries

create table public.notebooks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  emoji      text not null default '📓',
  created_at timestamptz not null default now()
);

create index notebooks_user_idx on public.notebooks(user_id, created_at desc);

alter table public.notebooks enable row level security;

create policy "owner can read notebooks"   on public.notebooks for select using (user_id = auth.uid());
create policy "owner can insert notebooks" on public.notebooks for insert with check (user_id = auth.uid());
create policy "owner can update notebooks" on public.notebooks for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "owner can delete notebooks" on public.notebooks for delete using (user_id = auth.uid());

-- journal entries

create table public.journal_entries (
  id            uuid primary key default gen_random_uuid(),
  notebook_id   uuid not null references public.notebooks(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text,
  body          text,
  location_name text,
  latitude      double precision,
  longitude     double precision,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index journal_entries_notebook_idx on public.journal_entries(notebook_id, created_at desc);
create index journal_entries_user_idx     on public.journal_entries(user_id, created_at desc);

create trigger journal_entries_set_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

alter table public.journal_entries enable row level security;

create policy "owner can read entries"   on public.journal_entries for select using (user_id = auth.uid());
create policy "owner can insert entries" on public.journal_entries for insert with check (user_id = auth.uid());
create policy "owner can update entries" on public.journal_entries for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "owner can delete entries" on public.journal_entries for delete using (user_id = auth.uid());
