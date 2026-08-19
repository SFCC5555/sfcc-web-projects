-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table tasks (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null default '',
  status      text        not null default 'todo'
                check (status in ('todo', 'in-progress', 'done')),
  priority    text        not null default 'medium'
                check (priority in ('high', 'medium', 'low')),
  category    text        not null default 'General',
  deadline    date,
  notes       text        not null default '',
  subtasks    jsonb       not null default '[]',
  recurring   text        not null default 'none'
                check (recurring in ('none', 'daily', 'weekly')),
  recur_time  text        not null default '08:00',
  recur_day   integer     not null default 1,
  created_at  timestamptz not null default now()
);

-- Only the logged-in admin can read/write tasks
alter table tasks enable row level security;

create policy "Authenticated users can manage tasks"
  on tasks for all
  to authenticated
  using (true)
  with check (true);
