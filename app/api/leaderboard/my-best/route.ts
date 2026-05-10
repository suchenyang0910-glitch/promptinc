import { NextResponse } from "next/server";

import { getServerSupabase } from "@/app/api/leaderboard/_supabase";

export async function GET(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Leaderboard unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const gameSlug = (searchParams.get("game_slug") ?? "").slice(0, 60);
  const playerName = (searchParams.get("player_name") ?? "").slice(0, 20);

  if (!gameSlug || !playerName) {
    return NextResponse.json({ best: 0 });
  }

  const { data, error } = await supabase
    .from("total_scores")
    .select("score")
    .eq("game_slug", gameSlug)
    .eq("player_name", playerName)
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ best: 0 });
  }

  const row = data as unknown as { score?: number | null } | null;
  return NextResponse.json({ best: Number(row?.score ?? 0) });
}
