"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const ICONS = ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍", "🥥"];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TileMatchGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tiles, setTiles] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);

  const reset = useCallback(() => {
    const base = shuffle(ICONS).slice(0, 8);
    setTiles(shuffle([...base, ...base]));
    setRevealed([]);
    setMatched(new Set());
    setMoves(0);
    setScore(0);
    setRunning(false);
    setGameOver(false);
    setTimeLeft(75);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    if (timeLeft <= 0) return;

    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          setRunning(false);
          setGameOver(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(t);
  }, [gameOver, running, timeLeft]);

  const canFlip = useMemo(() => running && !gameOver && revealed.length < 2, [gameOver, revealed.length, running]);

  const flip = useCallback(
    (idx: number) => {
      if (!canFlip) return;
      if (matched.has(idx)) return;
      if (revealed.includes(idx)) return;

      const next = [...revealed, idx];
      setRevealed(next);
      if (next.length !== 2) return;

      const [a, b] = next;
      setMoves((m) => m + 1);

      if (tiles[a] && tiles[a] === tiles[b]) {
        setMatched((prev) => {
          const s = new Set(prev);
          s.add(a);
          s.add(b);
          if (s.size === 16) {
            const bonus = Math.max(0, 400 - moves * 20) + timeLeft * 5;
            setScore((sc) => sc + 80 + bonus);
            setRunning(false);
            setGameOver(true);
          } else {
            setScore((sc) => sc + 80);
          }
          return s;
        });
        setRevealed([]);
        return;
      }

      window.setTimeout(() => setRevealed([]), 520);
    },
    [canFlip, matched, moves, revealed, tiles, timeLeft]
  );

  const primaryLabel = running ? "Pause" : game.clickButtonText;

  return (
    <RetroShell
      game={game}
      score={score}
      running={running}
      gameOver={gameOver}
      primaryLabel={primaryLabel}
      onPrimary={() => {
        if (gameOver) reset();
        setRunning((v) => !v);
      }}
      onReset={reset}
      hint="Tap tiles to flip. Match pairs to clear the board."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Moves: {moves}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="mx-auto grid grid-cols-4 gap-2 max-w-sm">
        {tiles.map((t, idx) => {
          const isUp = revealed.includes(idx) || matched.has(idx) || gameOver;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => flip(idx)}
              className={`h-16 rounded-xl border border-slate-700 flex items-center justify-center text-2xl ${
                isUp ? "bg-slate-950" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {isUp ? t : ""}
            </button>
          );
        })}
      </div>
    </RetroShell>
  );
}
