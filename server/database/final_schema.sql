-- GOLF HERO FINAL SCHEMA FULL SETUP
-- Run this entire script in your Supabase SQL Editor to ensure all tables, policies, and buckets exist.

-- 1. Create Tables
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
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
  constraint unique_user_charity unique (user_id)
);

create table if not exists draws (
  id uuid primary key default gen_random_uuid(),
  draw_month text,
  draw_numbers integer[],
  draw_type text check (draw_type in ('random', 'algorithm')),
  total_prize_pool numeric default 0,
  rollover_amount numeric default 0,
  pool_share_5_match numeric default 0,
  pool_share_4_match numeric default 0,
  pool_share_3_match numeric default 0,
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

-- 2. Storage Setup (Avatars & Proofs)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
update storage.buckets set public = true where id = 'avatars';

insert into storage.buckets (id, name, public) values ('score_proofs', 'score_proofs', true) on conflict do nothing;
update storage.buckets set public = true where id = 'score_proofs';

-- 3. Storage Policies
drop policy if exists "Avatars are public" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;

create policy "Avatars are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar" on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Users can update their own avatar" on storage.objects for update using (bucket_id = 'avatars');

-- 4. Reload PostgREST Cache
NOTIFY pgrst, 'reload schema';
