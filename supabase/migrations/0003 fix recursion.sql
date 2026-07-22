-- Fixes infinite recursion: admin policies were checking the profiles table,
-- which triggered the same policy again, in a loop.

drop policy "admins read all profiles" on profiles;
drop policy "admins read all reports" on reports;
drop policy "admins update reports" on reports;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create policy "admins read all profiles"
  on profiles for select
  using (public.is_admin());

create policy "admins read all reports"
  on reports for select
  using (public.is_admin());

create policy "admins update reports"
  on reports for update
  using (public.is_admin());
