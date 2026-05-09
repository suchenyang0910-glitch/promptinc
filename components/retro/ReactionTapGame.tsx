"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Target = { id: string; x: number; y: number; r: number };

function uid() {
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 8)}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function ReactionTapGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [target, setTarget] = useState<Target | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const hitThisSpawnRef = useRef(false);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setHits(0);
    setStreak(0);
    setMisses(0);
    setTarget(null);
    hitThisSpawnRef.current = false;
  }, []);

  const spawn = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const r = 22;
    const x = clamp(Math.random() * rect.width, r + 6, rect.width - r - 6);
    const y = clamp(Math.random() * rect.height, r + 6, rect.height - r - 6);
    setTarget({ id: uid(), x, y, r });
    hitThisSpawnRef.current = false;
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

  useEffect(() => {
    if (!running || gameOver) return;
    spawn();
    const t = window.setInterval(() => {
      if (!hitThisSpawnRef.current) {
        setMisses((m) => m + 1);
        setStreak(0);
      }
      spawn();
    }, 700);
    return () => window.clearInterval(t);
  }, [gameOver, running, spawn]);

  useEffect(() => {
    if (!gameOver) return;
    setTarget(null);
  }, [gameOver]);

  const hit = useCallback(() => {
    if (!running || gameOver) return;
    if (!target) return;
    if (hitThisSpawnRef.current) return;
    hitThisSpawnRef.current = true;
    setHits((h) => h + 1);
    setStreak((s) => s + 1);
    setScore((sc) => sc + 30 + Math.min(20, streak * 2));
    spawn();
  }, [gameOver, running, spawn, streak, target]);

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
      hint="Tap the target as fast as you can. Keep a streak for bonus points."
    >
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>Time: {timeLeft}s</div>
        <div>
          Hits: {hits} • Miss: {misses}
        </div>
      </div>

      <div
        ref={areaRef}
        className="relative mx-auto w-full max-w-[520px] h-[340px] rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden touch-none"
      >
        {target ? (
          <button
            type="button"
            onClick={hit}
            className="absolute rounded-full bg-emerald-500/90 border-2 border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
            style={{
              width: target.r * 2,
              height: target.r * 2,
              left: target.x - target.r,
              top: target.y - target.r,
            }}
          />
        ) : null}

        {!running ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">Press Start to begin</div>
        ) : null}
      </div>

      <div className="text-sm text-slate-300">Streak: {streak}</div>
    </RetroShell>
  );
}

