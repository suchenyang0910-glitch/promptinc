"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const PAIRS = 10;
const COLS = 5;

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export default function MemoryFlipGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75);

  const [tiles, setTiles] = useState<string[]>(() => {
    const base = Array.from({ length: PAIRS }, (_, i) => String.fromCharCode(65 + i));
    return shuffle([...base, ...base]);
  });
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const lockRef = useRef(false);

  const reset = useCallback(() => {
    const base = Array.from({ length: PAIRS }, (_, i) => String.fromCharCode(65 + i));
    setTiles(shuffle([...base, ...base]));
    setRevealed([]);
    setMatched(new Set());
    setMoves(0);
    setScore(0);
    setRunning(false);
    setGameOver(false);
    setTimeLeft(75);
    lockRef.current = false;
  }, []);

  const done = useMemo(() => matched.size === PAIRS * 2, [matched.size]);

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

  const flip = useCallback(
    (idx: number) => {
      if (!running || gameOver) return;
      if (lockRef.current) return;
      if (matched.has(idx)) return;
      if (revealed.includes(idx)) return;
      if (revealed.length >= 2) return;

      const nextRevealed = [...revealed, idx];
      setRevealed(nextRevealed);

      if (nextRevealed.length !== 2) return;

      lockRef.current = true;
      setMoves((m) => m + 1);
      const [a, b] = nextRevealed;
      const va = tiles[a!]!;
      const vb = tiles[b!]!;

      window.setTimeout(() => {
        if (va === vb) {
          setMatched((prev) => {
            const s = new Set(prev);
            s.add(a!);
            s.add(b!);
            if (s.size === PAIRS * 2) {
              setScore((sc) => sc + 120 + timeLeft * 6 + Math.max(0, 600 - (moves + 1) * 10));
              setRunning(false);
              setGameOver(true);
            } else {
              setScore((sc) => sc + 120);
            }
            return s;
          });
        } else {
          setScore((s) => Math.max(0, s - 10));
        }
        setRevealed([]);
        lockRef.current = false;
      }, 650);
    },
    [gameOver, matched, moves, revealed, running, tiles, timeLeft]
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
      hint="Flip two cards. Match pairs to clear the board before time ends."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Moves: {moves}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="mx-auto w-fit">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 56px)` }}>
          {tiles.map((t, idx) => {
            const open = matched.has(idx) || revealed.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => flip(idx)}
                className={`h-14 w-14 rounded-2xl border flex items-center justify-center text-xl font-bold select-none ${
                  open ? "bg-slate-950 border-slate-700" : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                }`}
              >
                {open ? t : ""}
              </button>
            );
          })}
        </div>
      </div>
    </RetroShell>
  );
}
