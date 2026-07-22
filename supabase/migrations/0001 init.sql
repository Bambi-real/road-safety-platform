-- 0001_init.sql

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'citizen' check (role in ('citizen', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "admins read all profiles"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "users update own profile"
  on profiles for update
  using (auth.uid() = id);

-- auto-create a profile row when someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  category text not null check (category in (
    'pothole', 'crack', 'flooded_road', 'broken_sign',
    'fallen_tree', 'accident', 'damaged_bridge', 'obstruction'
  )),
  description text,
  severity text default 'unrated' check (severity in (
    'unrated', 'low', 'medium', 'high', 'critical'
  )),
  status text default 'submitted' check (status in (
    'submitted', 'ai_processing', 'verified', 'assigned',
    'in_progress', 'resolved', 'closed'
  )),
  latitude double precision not null,
  longitude double precision not null,
  image_url text,
  ai_prediction text,
  ai_confidence numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reports enable row level security;

create policy "citizens insert own reports"
  on reports for insert
  with check (auth.uid() = user_id);

create policy "citizens read own reports"
  on reports for select
  using (auth.uid() = user_id);

create policy "admins read all reports"
  on reports for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins update reports"
  on reports for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
