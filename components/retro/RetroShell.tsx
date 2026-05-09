"use client";

import { useState } from "react";

import Leaderboard from "@/components/Leaderboard";
import AdSlot from "@/components/AdSlot";
import ShareButton from "@/components/ShareButton";
import SubmitScore from "@/components/SubmitScore";
import type { GameConfig } from "@/types/game";

export default function RetroShell({
  game,
  score,
  running,
  gameOver,
  primaryLabel,
  onPrimary,
  onReset,
  children,
  hint,
}: {
  game: GameConfig;
  score: number;
  running: boolean;
  gameOver: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  onReset: () => void;
  children: React.ReactNode;
  hint?: string;
}) {
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <section className="bg-slate-900 rounded-2xl p-6 text-center space-y-4">
        <div className="text-sm font-semibold tracking-wide text-slate-400">{game.currencyName.toUpperCase()}</div>
        <div className="text-4xl font-bold">
          {game.currencyName}: {Math.floor(score).toLocaleString()}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrimary}
            className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="bg-red-900 hover:bg-red-800 rounded-xl px-4 py-3 font-bold"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {hint ? <p className="text-slate-400">{hint}</p> : null}

        {gameOver ? (
          <div className="bg-red-950 border border-red-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-2xl font-bold">Game Over</h2>
            <p className="text-slate-300">Final Score: {Math.floor(score).toLocaleString()}</p>
            <button
              type="button"
              onClick={onReset}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold"
            >
              Play Again
            </button>

            <div className="pt-2">
              <AdSlot />
            </div>
          </div>
        ) : null}

        {!gameOver && running ? <p className="text-xs text-slate-500">Playing…</p> : null}
      </section>

      <ShareButton gameSlug={game.slug} />

      {gameOver ? (
        <SubmitScore gameSlug={game.slug} score={score} onSubmitted={() => setLeaderboardRefreshKey((v) => v + 1)} />
      ) : null}

      {gameOver ? <AdSlot /> : null}

      <Leaderboard gameSlug={game.slug} refreshKey={leaderboardRefreshKey} />
    </div>
  );
}
