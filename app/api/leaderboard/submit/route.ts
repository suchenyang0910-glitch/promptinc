import { NextResponse } from "next/server";

import { getServerSupabase } from "@/app/api/leaderboard/_supabase";

type SubmitBody = {
  game_slug?: unknown;
  player_name?: unknown;
  score?: unknown;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function POST(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Leaderboard unavailable (missing Supabase env)" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b: SubmitBody = isObject(body) ? (body as SubmitBody) : {};
  const game_slug = typeof b.game_slug === "string" ? b.game_slug : "";
  const player_name = typeof b.player_name === "string" ? b.player_name : "";
  const scoreRaw = b.score;
  const score = typeof scoreRaw === "number" ? Math.floor(scoreRaw) : Number.parseInt(String(scoreRaw), 10);

  if (!game_slug || game_slug.length > 60) {
    return NextResponse.json({ error: "Invalid game_slug" }, { status: 400 });
  }
  if (!player_name || player_name.length > 20) {
    return NextResponse.json({ error: "Invalid player_name" }, { status: 400 });
  }
  if (!Number.isFinite(score) || score < 0 || score > 100000000) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("game_scores")
    .insert({ game_slug, player_name, score })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Submit failed", code: error.code }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, created_at: data.created_at });
}
