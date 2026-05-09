"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type ScoreRow = {
  id: string;
  game_slug: string;
  player_name: string;
  score: number;
};

export default function Leaderboard({
  gameSlug,
  refreshKey,
}: {
  gameSlug: string;
  refreshKey: number;
}) {
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadScores() {
      setStatus("loading");
      const { data, error } = await supabase
        .from("leaderboard_scores")
        .select("id, game_slug, player_name, score")
        .eq("game_slug", gameSlug)
        .order("score", { ascending: false })
        .limit(10);

      if (cancelled) return;

      if (error) {
        setStatus("error");
        return;
      }

      setScores((data ?? []).map((row) => ({ ...row, score: Number(row.score) })));
      setStatus("idle");
    }

    loadScores();

    return () => {
      cancelled = true;
    };
  }, [gameSlug, refreshKey]);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-bold">Leaderboard</h2>

      {status === "loading" ? <p className="text-slate-400">Loading...</p> : null}
      {status === "error" ? <p className="text-slate-400">Failed to load leaderboard.</p> : null}
      {status === "idle" && scores.length === 0 ? <p className="text-slate-400">No scores yet.</p> : null}

      {scores.map((player, index) => (
        <div key={player.id} className="flex justify-between bg-slate-800 rounded-xl p-3">
          <span>
            #{index + 1} {player.player_name}
          </span>
          <span>{Math.floor(player.score).toLocaleString()}</span>
        </div>
      ))}

      <p className="text-xs text-slate-500 text-center">
        Leaderboard is for entertainment display only in this early version.
      </p>
    </section>
  );
}
