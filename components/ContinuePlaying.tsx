"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GameInfo = {
  slug: string;
  gameName: string;
  category: string;
  emoji: string;
};

export default function ContinuePlaying({ games }: { games: GameInfo[] }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("recent_games");
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      setRecentSlugs(arr.slice(0, 8));
    } catch {
      setRecentSlugs([]);
    }
  }, []);

  const recentGames = useMemo(() => {
    const map = new Map(games.map((g) => [g.slug, g] as const));
    return recentSlugs.map((s) => map.get(s)).filter(Boolean) as GameInfo[];
  }, [games, recentSlugs]);

  if (recentGames.length === 0) return null;

  const [first, ...rest] = recentGames;

  return (
    <section className="max-w-4xl mx-auto px-6 pb-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Continue Playing</h2>
          <Link href="/games" className="text-slate-400 hover:text-white text-sm">
            Browse games
          </Link>
        </div>

        <Link
          href={`/games/${first.slug}`}
          className="block rounded-2xl border border-slate-800 bg-slate-950/30 hover:bg-slate-800 p-5"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{first.emoji}</div>
            <div className="min-w-0">
              <div className="text-sm text-blue-400">{first.category}</div>
              <div className="text-xl font-bold truncate">{first.gameName}</div>
              <div className="mt-2 inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold">Continue</div>
            </div>
          </div>
        </Link>

        {rest.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {rest.map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm"
              >
                <span className="mr-2">{g.emoji}</span>
                {g.gameName}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

