create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, 
  avatar_url text, 
  role text DEFAULT 'subscriber' CHECK (role in ('subscriber', 'admin')),
  is_profile_complete boolean default false,
  rolling_avg numeric default 0,
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
  total_prize_pool numeric default 0,
  rollover_amount numeric default 0,
  pool_share_5_match numeric default 0,
  pool_share_4_match numeric default 0,
  pool_share_3_match numeric default 0,
  is_published boolean default false,
  processed_at timestamp,
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

create table charity_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  charity_id uuid references charities(id) on delete set null,
  amount numeric not null,
  type text check (type in ('subscription_share', 'independent_donation')),
  created_at timestamp default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at_column();
create trigger update_scores_updated_at before update on scores for each row execute function update_updated_at_column();
create trigger update_subscriptions_updated_at before update on subscriptions for each row execute function update_updated_at_column();
create trigger update_winners_updated_at before update on winners for each row execute function update_updated_at_column();

create or replace function maintain_rolling_five_scores()
returns trigger as $$
begin
    delete from scores
    where user_id = new.user_id
    and id not in (
        select id from scores
        where user_id = new.user_id
        order by played_at desc, created_at desc
        limit 5
    );

    update profiles
    set rolling_avg = (
        select coalesce(avg(score), 0)
        from (
            select score from scores
            where user_id = new.user_id
            order by played_at desc, created_at desc
            limit 5
        ) as recent_scores
    )
    where id = new.user_id;

    return new;
end;
$$ language plpgsql;

create trigger trigger_rolling_scores
after insert or update on scores
for each row execute function maintain_rolling_five_scores();

create or replace function sync_profile_subscription_status()
returns trigger as $$
begin
    update profiles
    set is_active_subscriber = exists (
        select 1 from subscriptions
        where user_id = coalesce(new.user_id, old.user_id)
        and status = 'active'
    )
    where id = coalesce(new.user_id, old.user_id);
    return null;
end;
$$ language plpgsql;

create trigger trigger_sync_subscription_status
after insert or update or delete on subscriptions
for each row execute function sync_profile_subscription_status();

create or replace function prevent_winner_update_if_not_pending()
returns trigger as $$
begin
    if old.status != 'pending' and (new.prize_amount != old.prize_amount or new.user_id != old.user_id or new.draw_id != old.draw_id) then
        raise exception 'Cannot modify a verified winner record.';
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trigger_protect_winner_records
before update on winners
for each row execute function prevent_winner_update_if_not_pending();

create or replace function is_admin() 
returns boolean as $$
begin
  return exists (
    select 1 from profiles 
    where id = auth.uid() 
    and role = 'admin'
  );
end;
$$ language plpgsql stable security definer set search_path = public;

alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table scores enable row level security;
alter table charities enable row level security;
alter table user_charities enable row level security;
alter table draws enable row level security;
alter table user_draw_entries enable row level security;
alter table winners enable row level security;
alter table charity_ledger enable row level security;

create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can see their own subscriptions" on subscriptions for select using (auth.uid() = user_id);
create policy "Users can manage their own scores" on scores for all using (auth.uid() = user_id);
create policy "Charities are viewable by everyone" on charities for select using (true);
create policy "Users can manage their own charity selection" on user_charities for all using (auth.uid() = user_id);
create policy "Published draws are viewable by everyone" on draws for select using (is_published = true or is_admin());
create policy "Admins can manage draws" on draws for all using (is_admin());
create policy "Users can see their own draw entries" on user_draw_entries for select using (auth.uid() = user_id);
create policy "Users can enter draws" on user_draw_entries for insert with check (auth.uid() = user_id);
create policy "Winners are viewable by everyone" on winners for select using (true);
create policy "Admins can manage winners" on winners for all using (is_admin());
create policy "Users can see their own ledger entries" on charity_ledger for select using (auth.uid() = user_id);
