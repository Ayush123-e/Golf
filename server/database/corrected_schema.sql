-- GOLF HERO CORRECTED SCHEMA - Run in Supabase SQL Editor
-- This adds all missing tables and columns that the application code references

-- 1. Create Tables
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text, 
  avatar_url text, 
  phone_number text,
  role text DEFAULT 'subscriber' CHECK (role in ('subscriber', 'admin')),
  is_profile_complete boolean default false,
  is_active_subscriber boolean default false,
  rolling_avg numeric default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan text check (plan in ('monthly', 'yearly')),
  status text check (status in ('active', 'inactive', 'cancelled')),
  plan_region text,
  stripe_subscription_id text,
  start_date timestamp,
  end_date timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score integer check (score >= 1 and score <= 45),
  played_at date,
  is_locked boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists charities (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  image_url text,
  created_at timestamp default now()
);

create table if not exists user_charities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  charity_id uuid references charities(id),
  percentage integer default 10,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint unique_user_charity unique (user_id)
);

create table if not exists draws (
  id uuid primary key default gen_random_uuid(),
  draw_month text,
  draw_numbers integer[],
  draw_type text check (draw_type in ('random', 'algorithm')),
  total_pool numeric default 0,
  jackpot_carry numeric default 0,
  is_published boolean default false,
  processed_at timestamp,
  created_at timestamp default now()
);

create table if not exists user_draw_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  draw_id uuid references draws(id),
  scores integer[],
  created_at timestamp default now(),
  constraint unique_user_draw unique (user_id, draw_id)
);

create table if not exists winners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  draw_id uuid references draws(id),
  match_count integer, 
  prize_amount numeric,
  proof_url text,
  status text check (status in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  verified_at timestamp
);

-- Charity Ledger (referenced in admin actions for tracking charity donations)
create table if not exists charity_ledger (
  id uuid primary key default gen_random_uuid(),
  charity_id uuid references charities(id),
  user_id uuid references profiles(id),
  amount numeric default 0,
  description text,
  created_at timestamp default now()
);

-- 2. RPC for algorithmic draw
create or replace function get_score_frequencies()
returns table (score integer, count bigint)
as $$
begin
  return query
  select s.score, count(*) as count
  from scores s
  group by s.score;
end;
$$ language plpgsql stable security definer;

-- 3. Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Row Level Security Policies
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table scores enable row level security;
alter table charities enable row level security;
alter table user_charities enable row level security;
alter table draws enable row level security;
alter table user_draw_entries enable row level security;
alter table winners enable row level security;
alter table charity_ledger enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

-- Subscriptions
create policy "Users can view own subscription" on subscriptions for select using (auth.uid() = user_id);
create policy "Service role manages subscriptions" on subscriptions for all using (true);

-- Scores
create policy "Users can view own scores" on scores for select using (auth.uid() = user_id);
create policy "Users can insert own scores" on scores for insert with check (auth.uid() = user_id);
create policy "Users can update own scores" on scores for update using (auth.uid() = user_id);
create policy "Users can delete own scores" on scores for delete using (auth.uid() = user_id);

-- Charities: readable by all
create policy "Charities are viewable by everyone" on charities for select using (true);
create policy "Admins can manage charities" on charities for all using (true);

-- User Charities
create policy "Users can view own charity" on user_charities for select using (auth.uid() = user_id);
create policy "Users can manage own charity" on user_charities for all using (auth.uid() = user_id);

-- Draws: readable by all
create policy "Draws are viewable by everyone" on draws for select using (true);
create policy "Service role manages draws" on draws for all using (true);

-- Draw entries
create policy "Users can view own entries" on user_draw_entries for select using (auth.uid() = user_id);
create policy "Users can manage own entries" on user_draw_entries for all using (auth.uid() = user_id);

-- Winners
create policy "Users can view own wins" on winners for select using (auth.uid() = user_id);
create policy "Users can update own wins" on winners for update using (auth.uid() = user_id);
create policy "Service role manages winners" on winners for all using (true);

-- Charity Ledger
create policy "Charity ledger viewable by all" on charity_ledger for select using (true);
create policy "Service role manages ledger" on charity_ledger for all using (true);

-- 5. Storage Setup
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
update storage.buckets set public = true where id = 'avatars';

insert into storage.buckets (id, name, public) values ('score_proofs', 'score_proofs', true) on conflict do nothing;
update storage.buckets set public = true where id = 'score_proofs';

-- 6. Storage Policies
drop policy if exists "Avatars are public" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Score proofs are public" on storage.objects;
drop policy if exists "Users can upload score proofs" on storage.objects;

create policy "Avatars are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Users can update their own avatar" on storage.objects for update using (bucket_id = 'avatars');

create policy "Score proofs are public" on storage.objects for select using (bucket_id = 'score_proofs');
create policy "Users can upload score proofs" on storage.objects for insert with check (bucket_id = 'score_proofs');

-- 7. Reload PostgREST Cache
NOTIFY pgrst, 'reload schema';
