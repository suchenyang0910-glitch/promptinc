create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leaderboard_scores enable row level security;

drop policy if exists "Anyone can read leaderboard" on public.leaderboard_scores;
create policy "Anyone can read leaderboard"
on public.leaderboard_scores
for select
using (true);

drop policy if exists "Anyone can submit score" on public.leaderboard_scores;
create policy "Anyone can submit score"
on public.leaderboard_scores
for insert
with check (true);

