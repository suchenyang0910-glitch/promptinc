"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GameInfo = {
  slug: string;
  gameName: string;
  category: string;
  emoji: string;
};

export default function GamePageStats({
  currentSlug,
  allGames,
}: {
  currentSlug: string;
  allGames: GameInfo[];
}) {
  const [plays, setPlays] = useState<number | null>(null);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const sessionKey = `played_session:${currentSlug}`;
      const countKey = `play_count:${currentSlug}`;

      const alreadyCounted = window.sessionStorage.getItem(sessionKey) === "1";
      const prev = Number(window.localStorage.getItem(countKey) ?? "0");
      const safePrev = Number.isFinite(prev) ? prev : 0;
      const next = alreadyCounted ? safePrev : safePrev + 1;

      if (!alreadyCounted) {
        window.localStorage.setItem(countKey, String(next));
        window.sessionStorage.setItem(sessionKey, "1");
      }

      window.setTimeout(() => setPlays(next), 0);

      const listKey = "recent_games";
      const raw = window.localStorage.getItem(listKey);
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      const nextList = [currentSlug, ...arr.filter((s) => s !== currentSlug)].slice(0, 8);
      window.localStorage.setItem(listKey, JSON.stringify(nextList));
      window.setTimeout(() => setRecentSlugs(nextList.filter((s) => s !== currentSlug)), 0);
    } catch {
      return;
    }
  }, [currentSlug]);

  const recentGames = useMemo(() => {
    const map = new Map(allGames.map((g) => [g.slug, g] as const));
    return recentSlugs.map((s) => map.get(s)).filter(Boolean) as GameInfo[];
  }, [allGames, recentSlugs]);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-slate-300">
          Plays: <span className="font-bold text-white">{plays == null ? "—" : plays.toLocaleString()}</span>
        </div>
        <Link href={`/games/${currentSlug}/leaderboard`} className="text-blue-400 hover:text-blue-300 font-semibold">
          View leaderboard →
        </Link>
      </div>

      {recentGames.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">Recently played</div>
          <div className="flex flex-wrap gap-2">
            {recentGames.map((g) => (
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
        </div>
      ) : null}
    </section>
  );
}
