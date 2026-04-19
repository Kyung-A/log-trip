create table public.travel_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  region_names text[] not null default '{}',
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

alter table public.travel_plans enable row level security;

create policy "own_plans" on public.travel_plans
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.travel_plans(id) on delete cascade,
  day_number int not null,
  title text not null,
  place text,
  time text not null,
  memo text,
  created_at timestamptz default now()
);

alter table public.plan_items enable row level security;

create policy "own_plan_items" on public.plan_items
  using (
    auth.uid() = (select user_id from public.travel_plans where id = plan_id)
  )
  with check (
    auth.uid() = (select user_id from public.travel_plans where id = plan_id)
  );
