-- M5.5: user profiles (display name + avatar).
create table public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  updated_at   timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "owner can read own profile"
  on public.profiles for select
  using (user_id = auth.uid());

create policy "owner can insert own profile"
  on public.profiles for insert
  with check (user_id = auth.uid());

create policy "owner can update own profile"
  on public.profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Storage bucket for avatars (run separately in Supabase dashboard if needed)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
