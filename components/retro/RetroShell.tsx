"use client";

import { useEffect, useRef, useState } from "react";

import Leaderboard from "@/components/Leaderboard";
import AdSlot from "@/components/AdSlot";
import InterstitialAd from "@/components/InterstitialAd";
import ShareButton from "@/components/ShareButton";
import SubmitScore from "@/components/SubmitScore";
import { canShowInterstitial, markInterstitialShown } from "@/lib/ads/policy";
import { track } from "@/lib/analytics";
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
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const prevRunningRef = useRef(false);
  const prevGameOverRef = useRef(false);

  useEffect(() => {
    if (!gameOver) return;
    try {
      const key = `best_score:${game.slug}`;
      const prev = Number(window.localStorage.getItem(key) ?? "0");
      const next = Math.max(prev, Math.floor(score));
      window.localStorage.setItem(key, String(next));
    } catch {
      return;
    }
  }, [game.slug, gameOver, score]);

  useEffect(() => {
    track("game_view", { game_slug: game.slug, game_type: game.gameType, category: game.category });
  }, [game.category, game.gameType, game.slug]);

  useEffect(() => {
    const prevRunning = prevRunningRef.current;
    if (!prevRunning && running) track("game_start", { game_slug: game.slug });
    if (prevRunning && !running && !gameOver) track("game_pause", { game_slug: game.slug });
    prevRunningRef.current = running;
  }, [game.slug, gameOver, running]);

  useEffect(() => {
    const prevGameOver = prevGameOverRef.current;
    if (!prevGameOver && gameOver) {
      track("game_over", { game_slug: game.slug, score: Math.floor(score) });
      if (canShowInterstitial()) {
        markInterstitialShown();
        track("ad_interstitial_shown", { game_slug: game.slug, slot: `${game.slug}-interstitial` });
        window.setTimeout(() => setInterstitialVisible(true), 0);
      }
    }
    prevGameOverRef.current = gameOver;
  }, [game.slug, gameOver, score]);

  return (
    <div className="space-y-6">
      {interstitialVisible ? (
        <InterstitialAd onClose={() => setInterstitialVisible(false)} slot={`${game.slug}-interstitial`} />
      ) : null}
      <section className="bg-slate-900 rounded-2xl p-6 text-center space-y-4">
        <div className="text-sm font-semibold tracking-wide text-slate-400">{game.currencyName.toUpperCase()}</div>
        <div className="text-4xl font-bold">
          {game.currencyName}: {Math.floor(score).toLocaleString()}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrimary}
            data-testid="retro-primary"
            className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              track("game_reset", { game_slug: game.slug });
              onReset();
            }}
            className="bg-red-900 hover:bg-red-800 rounded-xl px-4 py-3 font-bold"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4 overflow-hidden">{children}</div>

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
              <AdSlot variant="gameover" slot={`${game.slug}-gameover-modal`} />
            </div>
          </div>
        ) : null}

        {!gameOver && running ? <p className="text-xs text-slate-500">Playing…</p> : null}
        {!gameOver && running ? <span data-testid="retro-playing" className="sr-only">playing</span> : null}
      </section>

      <ShareButton gameSlug={game.slug} />

      {gameOver ? (
        <SubmitScore gameSlug={game.slug} score={score} onSubmitted={() => setLeaderboardRefreshKey((v) => v + 1)} />
      ) : null}

      {gameOver ? <AdSlot variant="banner" slot={`${game.slug}-gameover-after-submit`} /> : null}

      <Leaderboard gameSlug={game.slug} refreshKey={leaderboardRefreshKey} />
    </div>
  );
}
