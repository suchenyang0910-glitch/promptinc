"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const SIZE = 4;

type Dir = "up" | "down" | "left" | "right";

function cloneGrid(grid: number[][]) {
  return grid.map((r) => r.slice());
}

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

function emptyCells(grid: number[][]) {
  const out: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (grid[y][x] === 0) out.push({ x, y });
    }
  }
  return out;
}

function spawn(grid: number[][]) {
  const empties = emptyCells(grid);
  if (empties.length === 0) return grid;
  const pick = empties[Math.floor(Math.random() * empties.length)]!;
  const v = Math.random() < 0.9 ? 2 : 4;
  const next = cloneGrid(grid);
  next[pick.y][pick.x] = v;
  return next;
}

function canMove(grid: number[][]) {
  if (emptyCells(grid).length > 0) return true;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const v = grid[y][x];
      if (x + 1 < SIZE && grid[y][x + 1] === v) return true;
      if (y + 1 < SIZE && grid[y + 1][x] === v) return true;
    }
  }
  return false;
}

function compressLine(line: number[]) {
  const vals = line.filter((n) => n !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i += 1) {
    const cur = vals[i]!;
    const next = vals[i + 1];
    if (next !== undefined && next === cur) {
      const merged = cur * 2;
      out.push(merged);
      gained += merged;
      i += 1;
    } else {
      out.push(cur);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { out, gained };
}

function move(grid: number[][], dir: Dir) {
  const next = emptyGrid();
  let gained = 0;
  let changed = false;

  const getLine = (i: number) => {
    if (dir === "left" || dir === "right") {
      const row = grid[i]!.slice();
      return dir === "right" ? row.reverse() : row;
    }
    const col = Array.from({ length: SIZE }, (_, y) => grid[y]![i]!);
    return dir === "down" ? col.reverse() : col;
  };

  const setLine = (i: number, line: number[]) => {
    const src = dir === "right" || dir === "down" ? line.slice().reverse() : line;
    if (dir === "left" || dir === "right") {
      for (let x = 0; x < SIZE; x += 1) next[i]![x] = src[x]!;
    } else {
      for (let y = 0; y < SIZE; y += 1) next[y]![i] = src[y]!;
    }
  };

  for (let i = 0; i < SIZE; i += 1) {
    const line = getLine(i);
    const res = compressLine(line);
    gained += res.gained;
    setLine(i, res.out);
    if (!changed) {
      for (let j = 0; j < SIZE; j += 1) {
        if (res.out[j] !== line[j]) {
          changed = true;
          break;
        }
      }
    }
  }
  return { next, gained, changed };
}

function tileClass(v: number) {
  if (v === 0) return "bg-slate-800 border-slate-700";
  if (v <= 8) return "bg-slate-950 border-slate-700";
  if (v <= 32) return "bg-blue-950 border-blue-700";
  if (v <= 128) return "bg-purple-950 border-purple-700";
  if (v <= 512) return "bg-emerald-950 border-emerald-700";
  return "bg-amber-950 border-amber-700";
}

export default function NumberMergeGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<number[][]>(() => spawn(spawn(emptyGrid())));
  const [score, setScore] = useState(0);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setGrid(spawn(spawn(emptyGrid())));
  }, []);

  const doMove = useCallback(
    (dir: Dir) => {
      if (!running || gameOver) return;
      setGrid((prev) => {
        const res = move(prev, dir);
        if (!res.changed) return prev;
        setScore((s) => s + res.gained);
        const spawned = spawn(res.next);
        if (!canMove(spawned)) {
          setRunning(false);
          setGameOver(true);
        }
        return spawned;
      });
    },
    [gameOver, running]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp") doMove("up");
      if (e.key === "ArrowDown") doMove("down");
      if (e.key === "ArrowLeft") doMove("left");
      if (e.key === "ArrowRight") doMove("right");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [doMove]);

  const primaryLabel = running ? "Pause" : game.clickButtonText;

  const bestTile = useMemo(() => Math.max(...grid.flat()), [grid]);

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
      hint="Swipe or use arrows to merge. New tiles spawn each move."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Best Tile: {bestTile}</div>
        <div className="hidden sm:block">Arrow keys supported</div>
      </div>

      <div
        className="mx-auto w-fit touch-none select-none"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = dragRef.current;
          dragRef.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          const ax = Math.abs(dx);
          const ay = Math.abs(dy);
          if (Math.max(ax, ay) < 18) return;
          if (ax > ay) doMove(dx > 0 ? "right" : "left");
          else doMove(dy > 0 ? "down" : "up");
        }}
      >
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 72px)` }}>
          {grid.flatMap((row, y) =>
            row.map((v, x) => (
              <div
                key={`${x}-${y}`}
                className={`h-[72px] w-[72px] rounded-2xl border flex items-center justify-center font-bold text-xl ${tileClass(v)}`}
              >
                {v === 0 ? "" : v}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
        <div />
        <button type="button" onClick={() => doMove("up")} className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2">
          ↑
        </button>
        <div />
        <button type="button" onClick={() => doMove("left")} className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2">
          ←
        </button>
        <button type="button" onClick={() => doMove("down")} className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2">
          ↓
        </button>
        <button type="button" onClick={() => doMove("right")} className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2">
          →
        </button>
      </div>
    </RetroShell>
  );
}

