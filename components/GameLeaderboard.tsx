"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Period = "all" | "today" | "week";

type ScoreRow = {
  id: string;
  game_slug: string;
  player_name: string;
  score: number;
  created_at: string;
};

type TotalScoreViewRow = {
  game_slug: string;
  player_name: string;
  score: number;
  created_at: string | null;
};

type DailyScoreViewRow = {
  game_slug: string;
  player_name: string;
  score: number;
  created_at: string | null;
  day: string;
};

function getPeriodSince(period: Period) {
  const now = new Date();

  if (period === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  return null;
}

export default function GameLeaderboard({ gameSlug }: { gameSlug: string }) {
  const [period, setPeriod] = useState<Period>("all");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const since = useMemo(() => getPeriodSince(period), [period]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadScores() {
      setStatus("loading");

      let view: "total_scores" | "daily_scores" = "total_scores";
      if (period === "today") view = "daily_scores";
      if (period === "week") view = "daily_scores";

      let query = supabase
        .from(view)
        .select(view === "daily_scores" ? "game_slug, player_name, score, created_at, day" : "game_slug, player_name, score, created_at")
        .eq("game_slug", gameSlug)
        .order("score", { ascending: false })
        .limit(50);

      if (view === "daily_scores" && since) {
        query = query.gte("day", since.toISOString());
      }

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        setStatus("error");
        return;
      }

      if (view === "total_scores") {
        const rows = (data ?? []) as unknown as TotalScoreViewRow[];
        setScores(
          rows.map((row) => ({
            id: `${row.game_slug}:${row.player_name}:${row.created_at ?? ""}`,
            game_slug: row.game_slug,
            player_name: row.player_name,
            score: Number(row.score),
            created_at: row.created_at ?? new Date(0).toISOString(),
          }))
        );
      } else {
        const rows = (data ?? []) as unknown as DailyScoreViewRow[];
        setScores(
          rows.map((row) => ({
            id: `${row.game_slug}:${row.player_name}:${row.day}`,
            game_slug: row.game_slug,
            player_name: row.player_name,
            score: Number(row.score),
            created_at: row.created_at ?? new Date(0).toISOString(),
          }))
        );
      }
      setStatus("idle");
    }

    loadScores();

    return () => {
      cancelled = true;
    };
  }, [gameSlug, period, since]);

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
