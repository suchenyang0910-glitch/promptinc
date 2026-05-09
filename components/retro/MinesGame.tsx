"use client";

import { useCallback, useMemo, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  n: number;
};

const SIZE = 10;
const MINES = 12;

function keyOf(x: number, y: number) {
  return `${x},${y}`;
}

function neighbors(x: number, y: number) {
  const arr: Array<{ x: number; y: number }> = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
      arr.push({ x: nx, y: ny });
    }
  }
  return arr;
}

function buildGrid(seedSafe?: { x: number; y: number }) {
  const cells: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ mine: false, revealed: false, flagged: false, n: 0 }))
  );

  const forbidden = new Set<string>();
  if (seedSafe) {
    forbidden.add(keyOf(seedSafe.x, seedSafe.y));
    neighbors(seedSafe.x, seedSafe.y).forEach((p) => forbidden.add(keyOf(p.x, p.y)));
  }

  let placed = 0;
  while (placed < MINES) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);
    if (cells[y][x].mine) continue;
    if (forbidden.has(keyOf(x, y))) continue;
    cells[y][x].mine = true;
    placed += 1;
  }

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (cells[y][x].mine) continue;
      const n = neighbors(x, y).reduce((sum, p) => sum + (cells[p.y][p.x].mine ? 1 : 0), 0);
      cells[y][x].n = n;
    }
  }

  return cells;
}

function countRevealedSafe(grid: Cell[][]) {
  let n = 0;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (grid[y][x].revealed && !grid[y][x].mine) n += 1;
    }
  }
  return n;
}

export default function MinesGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>(() => buildGrid());

  const revealedSafe = useMemo(() => countRevealedSafe(grid), [grid]);

  const score = useMemo(() => revealedSafe * 10, [revealedSafe]);

  const totalSafe = SIZE * SIZE - MINES;

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setFlagMode(false);
    setGrid(buildGrid());
  }, []);

  const floodReveal = useCallback((sx: number, sy: number, next: Cell[][]) => {
    const q: Array<{ x: number; y: number }> = [{ x: sx, y: sy }];
    const seen = new Set<string>();

    while (q.length) {
      const cur = q.shift();
      if (!cur) break;
      const k = keyOf(cur.x, cur.y);
      if (seen.has(k)) continue;
      seen.add(k);
      const c = next[cur.y][cur.x];
      if (c.revealed || c.flagged) continue;
      c.revealed = true;
      if (c.n !== 0) continue;
      neighbors(cur.x, cur.y).forEach((p) => q.push(p));
    }
  }, []);

  const clickCell = useCallback(
    (x: number, y: number) => {
      if (!running || gameOver) return;
      setGrid((prev) => {
        let next = prev.map((row) => row.map((c) => ({ ...c })));

        if (revealedSafe === 0) {
          next = buildGrid({ x, y });
        }

        const c = next[y][x];
        if (c.revealed) return next;

        if (flagMode) {
          if (!c.revealed) c.flagged = !c.flagged;
          return next;
        }

        if (c.flagged) return next;
        if (c.mine) {
          c.revealed = true;
          setRunning(false);
          setGameOver(true);
          return next;
        }

        floodReveal(x, y, next);

        const safe = countRevealedSafe(next);
        if (safe >= totalSafe) {
          setRunning(false);
          setGameOver(true);
        }
        return next;
      });
    },
    [flagMode, floodReveal, gameOver, revealedSafe, running, totalSafe]
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
      hint="Tap to reveal. Toggle Flag Mode to mark mines."
    >
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setFlagMode((v) => !v)}
          className={`rounded-xl px-4 py-2 font-bold ${flagMode ? "bg-purple-700" : "bg-slate-800 hover:bg-slate-700"}`}
        >
          {flagMode ? "Flag Mode: ON" : "Flag Mode: OFF"}
        </button>
        <div className="text-sm text-slate-400">Safe: {revealedSafe}/{totalSafe}</div>
      </div>

      <div className="mx-auto w-fit">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${SIZE}, 32px)` }}>
          {grid.flatMap((row, y) =>
            row.map((c, x) => {
              const base = "w-8 h-8 border border-slate-700 flex items-center justify-center text-sm select-none";
              const cls = c.revealed ? "bg-slate-950" : "bg-slate-800 hover:bg-slate-700";
              const label = c.revealed ? (c.mine ? "💥" : c.n ? String(c.n) : "") : c.flagged ? "🚩" : "";
              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  onClick={() => clickCell(x, y)}
                  className={`${base} ${cls}`}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
      </div>
    </RetroShell>
  );
}
