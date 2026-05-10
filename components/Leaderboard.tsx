"use client";

import { useEffect, useState } from "react";

import { getTopScores } from "@/lib/leaderboard";
import type { ScoreEntry } from "@/lib/leaderboard";

export default function Leaderboard({ gameSlug, refreshKey }: { gameSlug: string; refreshKey: number }) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      const data = await getTopScores(gameSlug, 10);
      if (cancelled) return;
      setScores(data);
      setStatus("idle");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [gameSlug, refreshKey]);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
      <h2 className="text-2xl font-bold">Leaderboard</h2>

      {status === "loading" ? <p className="text-slate-400">Loading...</p> : null}
      {status === "error" ? <p className="text-slate-400">Failed to load leaderboard.</p> : null}
      {status === "idle" && scores.length === 0 ? <p className="text-slate-400">No scores yet.</p> : null}

      <div className="space-y-2">
        {scores.map((player, index) => (
          <div key={player.id} className="flex justify-between bg-slate-800 rounded-xl p-3">
            <span>
              #{index + 1} {player.player_name}
            </span>
            <span>{Math.floor(player.score).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
