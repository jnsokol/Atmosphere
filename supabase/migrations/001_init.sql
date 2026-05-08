-- M1: bootstrap. auth.users is managed by Supabase; nothing else yet.
-- Helper for updated_at columns added in later migrations.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
