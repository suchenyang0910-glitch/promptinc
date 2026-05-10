import { NextResponse } from "next/server";

import { getServerSupabase } from "@/app/api/leaderboard/_supabase";

type TotalScoreRow = {
  game_slug: string;
  player_name: string;
  score: number;
  created_at: string | null;
};

export async function GET(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Leaderboard unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const gameSlug = (searchParams.get("game_slug") ?? "").slice(0, 60);
  const limitRaw = searchParams.get("limit") ?? "30";
  const limit = Math.max(1, Math.min(100, Number.parseInt(limitRaw, 10) || 30));

  if (!gameSlug) {
    return NextResponse.json({ error: "Missing game_slug" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("total_scores")
    .select("game_slug, player_name, score, created_at")
    .eq("game_slug", gameSlug)
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }

  const rows = ((data ?? []) as TotalScoreRow[]).map((r, idx) => ({
    id: idx + 1,
    game_slug: r.game_slug,
    player_name: r.player_name,
    score: r.score,
    created_at: r.created_at,
  }));

  return NextResponse.json(rows);
}
