"use client";

import { useEffect, useMemo, useState } from "react";

import { getTopScores, getMyBest } from "@/lib/leaderboard";
import type { ScoreEntry } from "@/lib/leaderboard";

type Period = "all" | "today" | "week";

export default function GameLeaderboard({ gameSlug }: { gameSlug: string }) {
  const [period, setPeriod] = useState<Period>("all");
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const myBest = useMemo(() => {
    try {
      const key = `best_score:${gameSlug}`;
      const raw = window.localStorage.getItem(key);
      const n = raw ? Number(raw) : NaN;
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }, [gameSlug]);

  // simple client-side period filtering after loading
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      let data = await getTopScores(gameSlug, 50);
      if (cancelled) return;

      if (period !== "all") {
        const now = Date.now();
        const ms = period === "today" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
        const cutoff = now - ms;
        data = data.filter((s) => new Date(s.created_at).getTime() >= cutoff);
      }

      setScores(data);
      setStatus("idle");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [gameSlug, period]);

  // Re-fetch my best for the leaderboard submit refresh
  useEffect(() => {
    try {
      const name = window.localStorage.getItem("player_name");
      if (name) {
        getMyBest(gameSlug, name).then((best) => {
          if (best > 0) {
            window.localStorage.setItem(`best_score:${gameSlug}`, String(best));
          }
        });
      }
    } catch {
      // ignore
    }
  }, [gameSlug, scores]);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Top Scores</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
              period === "all" ? "bg-white/10 border-white/10" : "bg-slate-950/20 border-slate-800"
            }`}
          >
            All-time
          </button>
          <button
            type="button"
            onClick={() => setPeriod("today")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
              period === "today" ? "bg-white/10 border-white/10" : "bg-slate-950/20 border-slate-800"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setPeriod("week")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
              period === "week" ? "bg-white/10 border-white/10" : "bg-slate-950/20 border-slate-800"
            }`}
          >
            7 days
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-400">
        My best: {myBest == null ? "—" : myBest.toLocaleString()}
      </div>

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
