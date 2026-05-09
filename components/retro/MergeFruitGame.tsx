"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Grid = number[][];

const SIZE = 4;
const FRUITS = ["", "🍒", "🍓", "🍇", "🍊", "🍋", "🍎", "🍍", "🥭", "🍉"];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

function clone(g: Grid) {
  return g.map((r) => r.slice());
}

function addRandom(g: Grid) {
  const empties: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) if (g[y][x] === 0) empties.push({ x, y });
  if (!empties.length) return g;
  const pick = empties[Math.floor(Math.random() * empties.length)]!;
  const next = clone(g);
  next[pick.y][pick.x] = Math.random() < 0.9 ? 1 : 2;
  return next;
}

function compressLine(line: number[]) {
  const nums = line.filter((n) => n !== 0);
  const out: number[] = [];
  let score = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = Math.min(nums[i] + 1, FRUITS.length - 1);
      out.push(merged);
      score += merged * 25;
      i += 1;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, gained: score };
}

function moveGrid(g: Grid, dir: "L" | "R" | "U" | "D") {
  let moved = false;
  let gained = 0;
  const next = emptyGrid();

  if (dir === "L" || dir === "R") {
    for (let y = 0; y < SIZE; y += 1) {
      const row = g[y].slice();
      const line = dir === "R" ? row.reverse() : row;
      const res = compressLine(line);
      gained += res.gained;
      const out = dir === "R" ? res.line.slice().reverse() : res.line;
      next[y] = out;
      if (out.some((v, i) => v !== g[y][i])) moved = true;
    }
  } else {
    for (let x = 0; x < SIZE; x += 1) {
      const col = Array.from({ length: SIZE }, (_, y) => g[y][x]);
      const line = dir === "D" ? col.reverse() : col;
      const res = compressLine(line);
      gained += res.gained;
      const out = dir === "D" ? res.line.slice().reverse() : res.line;
      for (let y = 0; y < SIZE; y += 1) {
        next[y][x] = out[y]!;
        if (out[y] !== g[y][x]) moved = true;
      }
    }
  }

  return { grid: next, moved, gained };
}

function hasMoves(g: Grid) {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (g[y][x] === 0) return true;
      const v = g[y][x];
      if (x + 1 < SIZE && g[y][x + 1] === v) return true;
      if (y + 1 < SIZE && g[y + 1][x] === v) return true;
    }
  }
  return false;
}

export default function MergeFruitGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);

  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const bestFruit = useMemo(() => {
    let m = 0;
    for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) m = Math.max(m, grid[y][x]);
    return FRUITS[m] ?? "";
  }, [grid]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setGrid(addRandom(addRandom(emptyGrid())));
  }, []);

  const applyMove = useCallback(
    (dir: "L" | "R" | "U" | "D") => {
      if (!running || gameOver) return;
      setGrid((prev) => {
        const res = moveGrid(prev, dir);
        if (!res.moved) return prev;
        if (res.gained) setScore((s) => s + res.gained);
        const next = addRandom(res.grid);
        if (!hasMoves(next)) {
          setRunning(false);
          setGameOver(true);
        }
        return next;
      });
    },
    [gameOver, running]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running && !gameOver) setRunning(true);
      if (e.key === "ArrowLeft") applyMove("L");
      if (e.key === "ArrowRight") applyMove("R");
      if (e.key === "ArrowUp") applyMove("U");
      if (e.key === "ArrowDown") applyMove("D");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyMove, gameOver, running]);

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
      hint="Swipe or use arrows to merge matching fruits."
    >
      <div className="text-sm text-slate-400">Best: {bestFruit}</div>
      <div
        className="mx-auto w-fit rounded-2xl border border-slate-800 bg-slate-950 p-3"
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (!t) return;
          touchRef.current = { x: t.clientX, y: t.clientY };
          if (!running && !gameOver) setRunning(true);
        }}
        onTouchEnd={(e) => {
          const t0 = touchRef.current;
          const t1 = e.changedTouches[0];
          touchRef.current = null;
          if (!t0 || !t1) return;
          const dx = t1.clientX - t0.x;
          const dy = t1.clientY - t0.y;
          if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
          if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? "R" : "L");
          else applyMove(dy > 0 ? "D" : "U");
        }}
      >
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 64px)` }}>
          {grid.flatMap((row, y) =>
            row.map((v, x) => (
              <div
                key={`${x}-${y}`}
                className="h-16 w-16 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center text-3xl"
              >
                {v ? FRUITS[v] : ""}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <button type="button" onClick={() => applyMove("U")} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ↑
        </button>
        <div />
        <button type="button" onClick={() => applyMove("L")} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            if (!running && !gameOver) setRunning(true);
          }}
          className="bg-slate-900 border border-slate-800 rounded-xl py-4 text-xs font-bold"
        >
          SWIPE
        </button>
        <button type="button" onClick={() => applyMove("R")} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          →
        </button>
        <div />
        <button type="button" onClick={() => applyMove("D")} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ↓
        </button>
        <div />
      </div>
    </RetroShell>
  );
}

