create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  player_name text not null,
  score int not null,
  created_at timestamptz not null default now(),
  user_id uuid,
  device_hash text
);

create index if not exists game_scores_game_slug_score_idx
on public.game_scores (game_slug, score desc);

create index if not exists game_scores_game_slug_created_at_idx
on public.game_scores (game_slug, created_at desc);

alter table public.game_scores enable row level security;

drop policy if exists "Anyone can read game scores" on public.game_scores;
create policy "Anyone can read game scores"
on public.game_scores
for select
using (true);

drop policy if exists "Anyone can submit game score" on public.game_scores;
create policy "Anyone can submit game score"
on public.game_scores
for insert
with check (
  score >= 0
  and score <= 100000000
  and length(player_name) > 0
  and length(player_name) <= 20
  and length(game_slug) > 0
  and length(game_slug) <= 60
);

grant select, insert on public.game_scores to anon;
grant all privileges on public.game_scores to authenticated;

create or replace view public.total_scores as
select
  game_slug,
  player_name,
  max(score)::int as score,
  max(created_at) as created_at
from public.game_scores
group by game_slug, player_name;

grant select on public.total_scores to anon;
grant all privileges on public.total_scores to authenticated;

create or replace view public.daily_scores as
select
  game_slug,
  player_name,
  date_trunc('day', created_at) as day,
  max(score)::int as score,
  max(created_at) as created_at
from public.game_scores
group by game_slug, player_name, date_trunc('day', created_at);

grant select on public.daily_scores to anon;
grant all privileges on public.daily_scores to authenticated;

