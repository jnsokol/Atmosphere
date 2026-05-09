-- M5.5 update: add bio field to profiles.
alter table public.profiles add column bio text check (char_length(bio) <= 160);
