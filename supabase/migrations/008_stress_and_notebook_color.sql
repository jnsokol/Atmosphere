-- M8: add stress to mood entries, add color to notebooks

alter table public.mood_entries
  add column stress smallint check (stress between 1 and 10);

alter table public.notebooks
  add column color text not null default '#7cb9e8';
