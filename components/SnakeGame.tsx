"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Leaderboard from "@/components/Leaderboard";
import AdSlot from "@/components/AdSlot";
import InterstitialAd from "@/components/InterstitialAd";
import ShareButton from "@/components/ShareButton";
import SubmitScore from "@/components/SubmitScore";
import { canShowInterstitial, markInterstitialShown } from "@/lib/ads/policy";
import { track } from "@/lib/analytics";
import type { GameConfig } from "@/types/game";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const CELL_SIZE = 18;

type Point = { x: number; y: number };

function randomPoint(excluded: Point[]) {
  for (let attempts = 0; attempts < 200; attempts += 1) {
    const p = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const hit = excluded.some((e) => e.x === p.x && e.y === p.y);
    if (!hit) return p;
  }

  return { x: 0, y: 0 };
}

export default function SnakeGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef<Direction>("RIGHT");
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const gameOverRef = useRef(false);
  const runningRef = useRef(false);

  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    track("game_view", { game_slug: game.slug, game_type: game.gameType, category: game.category });
  }, [game.category, game.gameType, game.slug]);

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
    runningRef.current = running;
  }, [running]);

  const nextMilestone = useMemo(() => {
    return game.milestones.find((m) => score < m.money) ?? game.milestones[game.milestones.length - 1];
  }, [game.milestones, score]);

  const progress = useMemo(() => {
    const target = nextMilestone.money;
    const pct = target > 0 ? Math.min(1, Math.max(0, score / target)) : 0;
    return Math.round(pct * 100);
  }, [nextMilestone.money, score]);

  const changeDirection = useCallback((next: Direction) => {
    if (directionRef.current === "UP" && next === "DOWN") return;
    if (directionRef.current === "DOWN" && next === "UP") return;
    if (directionRef.current === "LEFT" && next === "RIGHT") return;
    if (directionRef.current === "RIGHT" && next === "LEFT") return;

    setDirection(next);
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    const initialFood = { x: 5, y: 5 };
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setRunning(false);

    snakeRef.current = initialSnake;
    foodRef.current = initialFood;
    directionRef.current = "RIGHT";
    gameOverRef.current = false;
    runningRef.current = false;

    track("game_reset", { game_slug: game.slug });
  }, [game.slug]);

  const endGame = useCallback(() => {
    setGameOver(true);
    setRunning(false);
    gameOverRef.current = true;
    runningRef.current = false;

    track("game_over", { game_slug: game.slug, score: Math.floor(score) });
    if (canShowInterstitial()) {
      markInterstitialShown();
      track("ad_interstitial_shown", { game_slug: game.slug, slot: `${game.slug}-interstitial` });
      setInterstitialVisible(true);
    }
  }, [game.slug, score]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e";
    snakeRef.current.forEach((part) => {
      ctx.fillRect(part.x * CELL_SIZE, part.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(foodRef.current.x * CELL_SIZE, foodRef.current.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!runningRef.current && !gameOverRef.current) setRunning(true);
      if (e.key === "ArrowUp") changeDirection("UP");
      if (e.key === "ArrowDown") changeDirection("DOWN");
      if (e.key === "ArrowLeft") changeDirection("LEFT");
      if (e.key === "ArrowRight") changeDirection("RIGHT");
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [changeDirection]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (gameOverRef.current) {
        draw();
        return;
      }

      if (!runningRef.current) {
        draw();
        return;
      }

      const currentSnake = snakeRef.current;
      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      if (dir === "UP") head.y -= 1;
      if (dir === "DOWN") head.y += 1;
      if (dir === "LEFT") head.x -= 1;
      if (dir === "RIGHT") head.x += 1;

      const outOfBounds = head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
      if (outOfBounds) {
        endGame();
        draw();
        return;
      }

      const hitSelf = currentSnake.some((part) => part.x === head.x && part.y === head.y);
      if (hitSelf) {
        endGame();
        draw();
        return;
      }

      const nextSnake = [head, ...currentSnake];
      const currentFood = foodRef.current;

      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore((s) => s + 1);
        const nextFood = randomPoint(nextSnake);
        setFood(nextFood);
        foodRef.current = nextFood;
      } else {
        nextSnake.pop();
      }

      setSnake(nextSnake);
      snakeRef.current = nextSnake;
      draw();
    }, 120);

    return () => window.clearInterval(interval);
  }, [draw, endGame]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      {interstitialVisible ? (
        <InterstitialAd onClose={() => setInterstitialVisible(false)} slot={`${game.slug}-interstitial`} />
      ) : null}
      <section className="bg-slate-900 rounded-2xl p-6 text-center space-y-4">
        <div className="text-sm font-semibold tracking-wide text-slate-400">{game.currencyName.toUpperCase()}</div>
        <div className="text-4xl font-bold">
          {game.currencyName}: {score}
        </div>

        <button
          type="button"
          onClick={() => {
            if (gameOverRef.current) resetGame();
            setRunning((v) => {
              const next = !v;
              if (next && !startedRef.current) {
                startedRef.current = true;
                track("game_start", { game_slug: game.slug });
              }
              if (!next && v && !gameOverRef.current) track("game_pause", { game_slug: game.slug });
              return next;
            });
          }}
          data-testid="snake-primary"
          className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold"
        >
          {running ? "Pause" : game.clickButtonText}
        </button>

        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="block w-full h-auto"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div />

          <button
            type="button"
            onClick={() => changeDirection("UP")}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
          >
            ↑
          </button>

          <div />

          <button
            type="button"
            onClick={() => changeDirection("LEFT")}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
          >
            ←
          </button>

          <button
            type="button"
            onClick={resetGame}
            className="bg-red-900 hover:bg-red-800 rounded-xl py-4 text-sm font-bold"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => changeDirection("RIGHT")}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
          >
            →
          </button>

          <div />

          <button
            type="button"
            onClick={() => changeDirection("DOWN")}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
          >
            ↓
          </button>

          <div />
        </div>

        <p className="text-slate-400">Use arrow keys on desktop or tap the buttons on mobile.</p>

        {gameOver ? (
          <div className="bg-red-950 border border-red-800 rounded-2xl p-4 space-y-3" data-testid="snake-gameover">
            <h2 className="text-2xl font-bold">Game Over</h2>
            <p className="text-slate-300">Final Score: {score}</p>
            <button
              type="button"
              onClick={resetGame}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold"
            >
              Play Again
            </button>

            <div className="pt-2">
              <AdSlot variant="gameover" slot={`${game.slug}-gameover-modal`} />
            </div>
          </div>
        ) : null}
      </section>

      <ShareButton gameSlug={game.slug} />

      {gameOver ? (
        <SubmitScore
          gameSlug={game.slug}
          score={score}
          onSubmitted={() => setLeaderboardRefreshKey((v) => v + 1)}
        />
      ) : null}

      {gameOver ? <AdSlot variant="banner" slot={`${game.slug}-gameover-after-submit`} /> : null}

      <Leaderboard gameSlug={game.slug} refreshKey={leaderboardRefreshKey} />

      <section className="bg-slate-900 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold">Next Goal</h2>
        <p className="text-slate-300">
          {nextMilestone.title} - {nextMilestone.money}
        </p>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>
    </div>
  );
}
