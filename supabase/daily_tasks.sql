-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Daily habits: independent from the `tasks` table.

create table daily_tasks (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  archived_at timestamptz,            -- null = active; set = hidden from new days, history kept
  created_at  timestamptz not null default now()
);

-- One row per task per day it was completed (no row = not done)
create table daily_task_logs (
  task_id     uuid        not null references daily_tasks(id) on delete cascade,
  day         date        not null,   -- calendar day in Ecuador time (America/Guayaquil)
  created_at  timestamptz not null default now(),
  primary key (task_id, day)
);

create index daily_task_logs_day_idx on daily_task_logs (day);

-- Only the logged-in admin can read/write
alter table daily_tasks enable row level security;
alter table daily_task_logs enable row level security;

create policy "Authenticated users can manage daily tasks"
  on daily_tasks for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage daily task logs"
  on daily_task_logs for all
  to authenticated
  using (true)
  with check (true);
