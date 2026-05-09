"use client";

import { useCallback, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Cell = string | null;

const W = 10;
const H = 12;
const COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa"];

function randColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!;
}

function empty(): Cell[][] {
  return Array.from({ length: H }, () => Array.from({ length: W }, () => null));
}

function clone(g: Cell[][]) {
  return g.map((r) => r.slice());
}

function neighbors(x: number, y: number) {
  const out: Array<{ x: number; y: number }> = [];
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  for (const d of dirs) {
    const nx = x + d.x;
    const ny = y + d.y;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    out.push({ x: nx, y: ny });
  }
  return out;
}

function popGroup(grid: Cell[][], sx: number, sy: number) {
  const color = grid[sy][sx];
  if (!color) return { grid, popped: 0 };
  const q: Array<{ x: number; y: number }> = [{ x: sx, y: sy }];
  const seen = new Set<string>();
  const group: Array<{ x: number; y: number }> = [];

  while (q.length) {
    const cur = q.shift();
    if (!cur) break;
    const k = `${cur.x},${cur.y}`;
    if (seen.has(k)) continue;
    seen.add(k);
    if (grid[cur.y][cur.x] !== color) continue;
    group.push(cur);
    neighbors(cur.x, cur.y).forEach((n) => q.push(n));
  }

  if (group.length < 3) return { grid, popped: 0 };
  const next = clone(grid);
  group.forEach((p) => {
    next[p.y][p.x] = null;
  });
  return { grid: next, popped: group.length };
}

function collapseDown(grid: Cell[][]) {
  const next = empty();
  for (let x = 0; x < W; x += 1) {
    const col: Cell[] = [];
    for (let y = 0; y < H; y += 1) {
      const v = grid[y][x];
      if (v) col.push(v);
    }
    for (let i = 0; i < col.length; i += 1) {
      next[H - 1 - i][x] = col[col.length - 1 - i];
    }
  }
  return next;
}

function addTopRow(grid: Cell[][]) {
  const next = empty();
  for (let y = H - 1; y > 0; y -= 1) next[y] = grid[y - 1].slice();
  next[0] = Array.from({ length: W }, () => randColor());
  return next;
}

export default function BubbleShooterGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>(() => {
    const g = empty();
    for (let y = 0; y < 7; y += 1) for (let x = 0; x < W; x += 1) g[y][x] = randColor();
    return g;
  });
  const [score, setScore] = useState(0);

  const reset = useCallback(() => {
    const g = empty();
    for (let y = 0; y < 7; y += 1) for (let x = 0; x < W; x += 1) g[y][x] = randColor();
    setGrid(g);
    setScore(0);
    setRunning(false);
    setGameOver(false);
  }, []);

  const tap = useCallback(
    (x: number, y: number) => {
      if (!running || gameOver) return;
      setGrid((prev) => {
        const { grid: poppedGrid, popped } = popGroup(prev, x, y);
        if (popped === 0) return prev;
        setScore((s) => s + popped * popped);
        const collapsed = collapseDown(poppedGrid);
        const next = addTopRow(collapsed);
        if (next[H - 1].some((c) => c !== null)) {
          setRunning(false);
          setGameOver(true);
        }
        return next;
      });
    },
    [gameOver, running]
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
      hint="Tap bubble groups (3+) to pop. Big groups score more."
    >
      <div className="mx-auto w-fit">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${W}, 28px)` }}>
          {grid.flatMap((row, y) =>
            row.map((c, x) => {
              const base = "w-7 h-7 border border-slate-800";
              if (!c) {
                return <div key={`${x}-${y}`} className={`${base} bg-slate-950`} />;
              }
              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  onClick={() => tap(x, y)}
                  className={`${base} rounded-full`}
                  style={{ backgroundColor: c }}
                />
              );
            })
          )}
        </div>
      </div>
    </RetroShell>
  );
}
