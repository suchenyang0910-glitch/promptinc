"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Color = "red" | "blue" | "green" | "yellow";
type Tube = Color[];

const CAP = 4;

const COLORS: Record<Color, { bg: string; label: string }> = {
  red: { bg: "bg-rose-500", label: "R" },
  blue: { bg: "bg-sky-500", label: "B" },
  green: { bg: "bg-emerald-500", label: "G" },
  yellow: { bg: "bg-amber-400", label: "Y" },
};

function isSolved(tubes: Tube[]) {
  return tubes.every((t) => t.length === 0 || (t.length === CAP && t.every((c) => c === t[0])));
}

function topRun(tube: Tube) {
  if (tube.length === 0) return { color: null as Color | null, n: 0 };
  const color = tube[tube.length - 1]!;
  let n = 1;
  for (let i = tube.length - 2; i >= 0; i -= 1) {
    if (tube[i] !== color) break;
    n += 1;
  }
  return { color, n };
}

function makeStart() {
  const pool: Color[] = [];
  (Object.keys(COLORS) as Color[]).forEach((c) => {
    for (let i = 0; i < CAP; i += 1) pool.push(c);
  });
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  const tubes: Tube[] = [[], [], [], [], []];
  let idx = 0;
  for (let t = 0; t < 4; t += 1) {
    for (let k = 0; k < CAP; k += 1) {
      tubes[t]!.push(pool[idx++]!);
    }
  }
  return tubes;
}

export default function ColorSortGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tubes, setTubes] = useState<Tube[]>(() => makeStart());
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [score, setScore] = useState(0);
  const movesRef = useRef(0);

  const solved = useMemo(() => isSolved(tubes), [tubes]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setTubes(makeStart());
    setSelected(null);
    setMoves(0);
    setTimeLeft(180);
    setScore(0);
    movesRef.current = 0;
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

  const pour = useCallback(
    (fromIdx: number, toIdx: number) => {
      let didMove = false;
      let solvedNow = false;

      setTubes((prev) => {
        const from = prev[fromIdx]!;
        const to = prev[toIdx]!;
        if (from.length === 0) return prev;
        const run = topRun(from);
        if (!run.color) return prev;
        if (to.length > 0 && to[to.length - 1] !== run.color) return prev;
        const space = CAP - to.length;
        if (space <= 0) return prev;
        const moved = Math.min(space, run.n);
        const next = prev.map((t) => t.slice());
        const src = next[fromIdx]!;
        const dst = next[toIdx]!;
        for (let i = 0; i < moved; i += 1) {
          const c = src.pop();
          if (!c) break;
          dst.push(c);
        }
        didMove = true;
        solvedNow = isSolved(next);
        return next;
      });

      if (!didMove) return;

      const nm = movesRef.current + 1;
      movesRef.current = nm;
      setMoves(nm);

      if (solvedNow) {
        const final = Math.max(0, 2500 - nm * 15) + timeLeft * 8;
        setScore(final);
        setRunning(false);
        setGameOver(true);
      } else {
        setScore((s) => s + 5);
      }
    },
    [timeLeft]
  );

  const tapTube = useCallback(
    (idx: number) => {
      if (!running || gameOver) return;
      if (selected === null) {
        if (tubes[idx]!.length === 0) return;
        setSelected(idx);
        return;
      }
      if (selected === idx) {
        setSelected(null);
        return;
      }
      pour(selected, idx);
      setSelected(null);
    },
    [gameOver, pour, running, selected, tubes]
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
      hint="Tap a tube, then tap another to pour. Solve before time runs out."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Moves: {moves}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="mx-auto w-fit grid grid-cols-5 gap-3">
        {tubes.map((tube, idx) => {
          const active = selected === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => tapTube(idx)}
              className={`h-40 w-14 rounded-2xl border flex flex-col justify-end p-2 gap-2 bg-slate-950 ${
                active ? "border-yellow-400" : "border-slate-700 hover:border-slate-500"
              }`}
            >
              {Array.from({ length: CAP }, (_, k) => {
                const v = tube[k];
                return (
                  <div
                    key={k}
                    className={`h-6 rounded-lg border border-slate-900 ${v ? COLORS[v].bg : "bg-slate-800"}`}
                  />
                );
              })}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-500">Selected: {selected === null ? "-" : selected + 1}</div>
    </RetroShell>
  );
}
