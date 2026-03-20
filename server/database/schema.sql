-- =========================
-- PROFILES (extends auth.users)
-- =========================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamp default now()
);

-- =========================
-- SUBSCRIPTIONS
-- =========================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan text check (plan in ('monthly', 'yearly')),
  status text check (status in ('active', 'inactive', 'cancelled')),
  start_date timestamp,
  end_date timestamp,
  created_at timestamp default now()
);

-- =========================
-- SCORES (CRITICAL LOGIC)
-- =========================
create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score integer check (score >= 1 and score <= 45),
  played_at date,
  created_at timestamp default now()
);

-- =========================
-- CHARITIES
-- =========================
create table charities (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  image_url text,
  created_at timestamp default now()
);

-- =========================
-- USER CHARITY
-- =========================
create table user_charities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  charity_id uuid references charities(id),
  percentage integer default 10,
  created_at timestamp default now()
);

-- =========================
-- DRAWS
-- =========================
create table draws (
  id uuid primary key default gen_random_uuid(),
  draw_month text,
  numbers integer[],
  is_published boolean default false,
  created_at timestamp default now()
);

-- =========================
-- WINNERS
-- =========================
create table winners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  draw_id uuid references draws(id),
  match_type text check (match_type in ('3', '4', '5')),
  prize_amount numeric,
  proof_url text,
  status text check (status in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamp default now()
);
