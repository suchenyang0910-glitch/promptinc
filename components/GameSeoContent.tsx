import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import type { GameConfig } from "@/types/game";
import { categoryToSlug } from "@/lib/categories";

export default function GameSeoContent({ game }: { game: GameConfig }) {
  const categorySlug = categoryToSlug(game.category);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-6 border border-slate-800">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p className="text-slate-300">
          {game.gameName} is a free {game.category} browser game. Tap or press start, learn the mechanics in seconds, and
          aim for a new personal best.
        </p>
        <p className="text-slate-300">
          For the best experience, play fullscreen on desktop or use touch controls on mobile. Your best score is saved
          locally, and you can submit a score to the leaderboard after a run.
        </p>
      </div>

      <AdSlot variant="inline" slot={`${game.slug}-content-inline-1`} />

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tips & Strategy</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Start slow: focus on consistent decisions before chasing speed.</li>
          <li>Optimize for survival first, then push for score once you feel stable.</li>
          <li>Replay short sessions: frequent retries improve patterns and reaction time.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">More {game.category} Games</h2>
        <p className="text-slate-300">
          Looking for similar games? Browse more {game.category} titles and find a new favorite.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/categories/${categorySlug}`}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 font-semibold"
          >
            Explore {game.category}
          </Link>
          <Link href="/leaderboards" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
            Leaderboards
          </Link>
          <Link href="/games" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
            All games
          </Link>
        </div>
      </div>
    </section>
  );
}

