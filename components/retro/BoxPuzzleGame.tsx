"use client";

import { useCallback, useEffect, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Tile = "wall" | "floor" | "target";
type Pos = { x: number; y: number };

const LEVELS = [
  [
    "#####",
    "#..x#",
    "#..b#",
    "#p..#",
    "#####",
  ],
  [
    "######",
    "#..x.#",
    "#..b.#",
    "#..b.#",
    "#p...#",
    "######",
  ],
  [
    "#######",
    "#..x..#",
    "#..b..#",
    "#..b..#",
    "#..x..#",
    "#p....#",
    "#######",
  ],
];

function parseLevel(lines: string[]) {
  const h = lines.length;
  const w = Math.max(...lines.map((s) => s.length));
  const tiles: Tile[][] = Array.from({ length: h }, () => Array.from({ length: w }, () => "floor"));
  const targets: Pos[] = [];
  const boxes: Pos[] = [];
  let player: Pos = { x: 0, y: 0 };

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const ch = lines[y][x] ?? "#";
      if (ch === "#") tiles[y][x] = "wall";
      if (ch === ".") tiles[y][x] = "floor";
      if (ch === "x") {
        tiles[y][x] = "target";
        targets.push({ x, y });
      }
      if (ch === "b") {
        tiles[y][x] = "floor";
        boxes.push({ x, y });
      }
      if (ch === "p") {
        tiles[y][x] = "floor";
        player = { x, y };
      }
    }
  }

  return { w, h, tiles, targets, boxes, player };
}

function samePos(a: Pos, b: Pos) {
  return a.x === b.x && a.y === b.y;
}

function hasBox(boxes: Pos[], x: number, y: number) {
  return boxes.findIndex((b) => b.x === x && b.y === y);
}

export default function BoxPuzzleGame({ game }: { game: GameConfig }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const [state, setState] = useState(() => parseLevel(LEVELS[0]!));

  const reset = useCallback(
    (idx?: number) => {
      const actual = idx ?? levelIdx;
      setState(parseLevel(LEVELS[actual]!));
    setMoves(0);
    setScore(0);
    setRunning(false);
    setGameOver(false);
    setTimeLeft(120);
    },
    [levelIdx]
  );

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

  const move = useCallback(
    (dx: number, dy: number) => {
      if (!running || gameOver) return;
      setState((prev) => {
        const nx = prev.player.x + dx;
        const ny = prev.player.y + dy;
        if (nx < 0 || ny < 0 || nx >= prev.w || ny >= prev.h) return prev;
        if (prev.tiles[ny][nx] === "wall") return prev;

        const bi = hasBox(prev.boxes, nx, ny);
        if (bi >= 0) {
          const bx = nx + dx;
          const by = ny + dy;
          if (bx < 0 || by < 0 || bx >= prev.w || by >= prev.h) return prev;
          if (prev.tiles[by][bx] === "wall") return prev;
          if (hasBox(prev.boxes, bx, by) >= 0) return prev;
          const nextBoxes = prev.boxes.map((b, i) => (i === bi ? { x: bx, y: by } : b));
          setMoves((m) => m + 1);
          const nextState = { ...prev, boxes: nextBoxes, player: { x: nx, y: ny } };
          const done = prev.targets.every((t) => nextState.boxes.some((b) => samePos(b, t)));
          if (done) {
            const base = 800;
            const s = Math.max(100, base - (moves + 1) * 10) + levelIdx * 200;
            setScore(s);
            setRunning(false);
            setGameOver(true);
          }
          return nextState;
        }

        setMoves((m) => m + 1);
        const nextState = { ...prev, player: { x: nx, y: ny } };
        return nextState;
      });
    },
    [gameOver, levelIdx, moves, running]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running && !gameOver) setRunning(true);
      if (e.key === "ArrowUp") move(0, -1);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, move, running]);

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
      hint="Push boxes onto targets. Use arrows or buttons."
    >
      <div className="flex items-center justify-center gap-3">
        <div className="text-sm text-slate-400">Level {levelIdx + 1}/{LEVELS.length}</div>
        <button
          type="button"
          onClick={() => {
            const next = (levelIdx + 1) % LEVELS.length;
            setLevelIdx(next);
            reset(next);
          }}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-2 font-bold"
        >
          Next Level
        </button>
        <div className="text-sm text-slate-400">Moves: {moves}</div>
        <div className="text-sm text-slate-400">Time: {timeLeft}s</div>
      </div>

      <div className="mx-auto w-fit">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${state.w}, 28px)` }}>
          {Array.from({ length: state.h }).flatMap((_, y) =>
            Array.from({ length: state.w }).map((__, x) => {
              const tile = state.tiles[y][x];
              const isPlayer = state.player.x === x && state.player.y === y;
              const box = state.boxes.some((b) => b.x === x && b.y === y);
              const base = "w-7 h-7 border border-slate-800 flex items-center justify-center";
              const bg = tile === "wall" ? "bg-slate-800" : "bg-slate-950";
              const target = tile === "target";
              return (
                <div key={`${x}-${y}`} className={`${base} ${bg}`}>
                  {target ? "🎯" : null}
                  {box ? "📦" : null}
                  {isPlayer ? "🙂" : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <button type="button" onClick={() => move(0, -1)} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ↑
        </button>
        <div />
        <button type="button" onClick={() => move(-1, 0)} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            if (!running && !gameOver) setRunning(true);
          }}
          className="bg-slate-900 border border-slate-800 rounded-xl py-4 text-xs font-bold"
        >
          GO
        </button>
        <button type="button" onClick={() => move(1, 0)} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          →
        </button>
        <div />
        <button type="button" onClick={() => move(0, 1)} className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl">
          ↓
        </button>
        <div />
      </div>
    </RetroShell>
  );
}
