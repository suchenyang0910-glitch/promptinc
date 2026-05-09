alter table public.leaderboard_scores
add column if not exists game_slug text not null default 'promptinc';

update public.leaderboard_scores
set game_slug = 'promptinc'
where game_slug is null or game_slug = '';

create index if not exists leaderboard_scores_game_slug_score_idx
on public.leaderboard_scores (game_slug, score desc);

grant select, insert on public.leaderboard_scores to anon;
grant all privileges on public.leaderboard_scores to authenticated;

