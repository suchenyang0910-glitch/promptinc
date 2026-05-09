"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Pos = { x: number; y: number };

const GRID: string[][] = [
  ["C", "O", "D", "E"],
  ["G", "A", "M", "E"],
  ["P", "L", "A", "Y"],
  ["T", "A", "P", "S"],
];

const TARGETS = ["CODE", "GAME", "PLAY", "TAP", "TAPS", "MAP", "ME", "GO"]; 

function keyOf(p: Pos) {
  return `${p.x},${p.y}`;
}

function isAdjacent(a: Pos, b: Pos) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx <= 1 && dy <= 1 && (dx + dy) > 0;
}

export default function WordConnectGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75);
  const [score, setScore] = useState(0);
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [path, setPath] = useState<Pos[]>([]);
  const dragRef = useRef(false);

  const targetSet = useMemo(() => new Set(TARGETS.map((w) => w.toUpperCase())), []);
  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setTimeLeft(75);
    setScore(0);
    setFound(new Set());
    setPath([]);
    dragRef.current = false;
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

  const currentWord = useMemo(() => path.map((p) => GRID[p.y]![p.x]!).join(""), [path]);
  const selectedKeys = useMemo(() => new Set(path.map(keyOf)), [path]);

  const begin = useCallback(
    (p: Pos) => {
      if (!running || gameOver) return;
      dragRef.current = true;
      setPath([p]);
    },
    [gameOver, running]
  );

  const extend = useCallback(
    (p: Pos) => {
      if (!dragRef.current) return;
      setPath((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return [p];
        if (prev.some((x) => x.x === p.x && x.y === p.y)) return prev;
        if (!isAdjacent(last, p)) return prev;
        return [...prev, p];
      });
    },
    []
  );

  const end = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = false;
    const word = currentWord.toUpperCase();
    if (word.length >= 2 && targetSet.has(word)) {
      let completed = false;
      setFound((prev) => {
        if (prev.has(word)) return prev;
        const next = new Set(prev);
        next.add(word);
        if (next.size >= targetSet.size) completed = true;
        return next;
      });
      const base = 120 + Math.max(0, word.length - 2) * 25;
      if (completed) {
        setScore((s) => s + base + timeLeft * 8);
        setRunning(false);
        setGameOver(true);
      } else {
        setScore((s) => s + base);
      }
    }
    setPath([]);
  }, [currentWord, targetSet, timeLeft]);

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
      hint="Drag across adjacent letters to form target words."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Time: {timeLeft}s</div>
        <div>
          Found: {found.size}/{targetSet.size}
        </div>
      </div>

      <div className="mx-auto w-fit">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID[0]!.length}, 64px)` }}>
          {GRID.flatMap((row, y) =>
            row.map((ch, x) => {
              const k = `${x},${y}`;
              const sel = selectedKeys.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  className={`h-16 w-16 rounded-2xl border text-2xl font-bold select-none touch-none ${
                    sel ? "bg-yellow-500 text-black border-yellow-300" : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                  }`}
                  onPointerDown={() => begin({ x, y })}
                  onPointerEnter={() => extend({ x, y })}
                  onPointerUp={end}
                  onPointerCancel={end}
                >
                  {ch}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="text-sm text-slate-300">Current: {currentWord || "-"}</div>

      <div className="grid sm:grid-cols-2 gap-2 text-left">
        {Array.from(targetSet).map((w) => {
          const ok = found.has(w);
          return (
            <div key={w} className={`rounded-xl px-3 py-2 ${ok ? "bg-emerald-900/30 text-emerald-200" : "bg-slate-800"}`}>
              {ok ? "✓ " : ""}
              {w}
            </div>
          );
        })}
      </div>
    </RetroShell>
  );
}
