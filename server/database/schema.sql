create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan text check (plan in ('monthly', 'yearly')),
  status text check (status in ('active', 'inactive', 'cancelled')),
  start_date timestamp,
  end_date timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create unique index one_active_subscription on subscriptions(user_id) where status = 'active';

create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score integer check (score >= 1 and score <= 45),
  played_at date,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index idx_scores_user on scores(user_id);

create table charities (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  image_url text,
  created_at timestamp default now()
);

create table user_charities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  charity_id uuid references charities(id),
  percentage integer default 10,
  created_at timestamp default now(),
  constraint unique_user_charity unique (user_id)
);

create table draws (
  id uuid primary key default gen_random_uuid(),
  draw_month text,
  draw_numbers integer[],
  draw_type text check (draw_type in ('random', 'algorithm')),
  is_published boolean default false,
  created_at timestamp default now(),
  constraint draw_numbers_length check (array_length(draw_numbers, 1) = 5)
);

create table user_draw_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  draw_id uuid references draws(id),
  scores integer[],
  created_at timestamp default now(),
  constraint unique_user_draw unique (user_id, draw_id),
  constraint scores_length check (array_length(scores, 1) = 5)
);

create index idx_entries_draw on user_draw_entries(draw_id);

create table winners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  draw_id uuid references draws(id),
  match_count integer, 
  prize_amount numeric,
  proof_url text,
  status text check (status in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  verified_at timestamp,
  constraint match_check check (match_count in (3, 4, 5))
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
before update on profiles
for each row execute function update_updated_at_column();

create trigger update_scores_updated_at
before update on scores
for each row execute function update_updated_at_column();

create trigger update_subscriptions_updated_at
before update on subscriptions
for each row execute function update_updated_at_column();

create trigger update_winners_updated_at
before update on winners
for each row execute function update_updated_at_column();
