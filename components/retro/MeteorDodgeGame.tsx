"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const CW = 360;
const CH = 520;

type Meteor = { id: string; x: number; y: number; r: number; vy: number };
type Star = { x: number; y: number; r: number; vy: number; a: number };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function MeteorDodgeGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(1);

  const playerRef = useRef({ x: CW / 2, y: CH - 86, r: 14 });
  const dirRef = useRef({ x: 0 });
  const meteorsRef = useRef<Meteor[]>([]);
  const lastMeteorRef = useRef(0);
  const lastStepRef = useRef<number | null>(null);
  const lastScoreRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);

  const difficulty = useMemo(() => 1 + Math.min(3.5, score / 220), [score]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setLives(1);
    playerRef.current = { x: CW / 2, y: CH - 86, r: 14 };
    dirRef.current = { x: 0 };
    meteorsRef.current = [];
    lastMeteorRef.current = 0;
    lastStepRef.current = null;
    lastScoreRef.current = null;
    starsRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.3 + Math.random() * 1.2,
      a: 0.25 + Math.random() * 0.7,
    }));
  }, []);

  const end = useCallback(() => {
    setRunning(false);
    setGameOver(true);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 70 }, () => ({
        x: Math.random() * CW,
        y: Math.random() * CH,
        r: 0.6 + Math.random() * 1.8,
        vy: 0.3 + Math.random() * 1.2,
        a: 0.25 + Math.random() * 0.7,
      }));
    }

    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0b1224");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    starsRef.current.forEach((s) => {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui";
    ctx.fillText(`Life: ${lives}`, 14, 22);

    for (const m of meteorsRef.current) {
      const g = ctx.createRadialGradient(m.x - m.r * 0.3, m.y - m.r * 0.3, 2, m.x, m.y, m.r * 1.3);
      g.addColorStop(0, "#fb7185");
      g.addColorStop(1, "#7f1d1d");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(254, 226, 226, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    }

    const p = playerRef.current;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#bfdbfe";
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(6, 10);
    ctx.lineTo(0, 6);
    ctx.lineTo(-6, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (!running && !gameOver) {
      ctx.fillStyle = "rgba(148,163,184,0.95)";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Move to dodge meteors", CW / 2, CH / 2 - 12);
      ctx.fillText("Arrow keys or buttons", CW / 2, CH / 2 + 12);
    }
  }, [gameOver, lives, running]);

  const step = useCallback(
    (now: number) => {
      if (!running || gameOver) return;
      const prev = lastStepRef.current;
      lastStepRef.current = now;
      const dt = prev ? Math.min(34, now - prev) : 16;

      const p = playerRef.current;
      const dx = dirRef.current.x;
      const speed = 0.18 + 0.06 * difficulty;
      p.x = clamp(p.x + dx * speed * dt * 60, p.r, CW - p.r);

      if (!lastScoreRef.current) lastScoreRef.current = now;
      const elapsed = now - (lastScoreRef.current ?? now);
      if (elapsed > 120) {
        lastScoreRef.current = now;
        setScore((s) => s + Math.max(1, Math.floor(1 + difficulty)));
      }

      starsRef.current = starsRef.current.map((s) => {
        const ny = s.y + s.vy * (1 + difficulty * 0.25) * (dt / 16);
        return ny > CH + 10 ? { ...s, y: -10, x: Math.random() * CW } : { ...s, y: ny };
      });

      const spawnEvery = 560 / difficulty;
      if (now - lastMeteorRef.current > spawnEvery) {
        lastMeteorRef.current = now;
        const r = 10 + Math.random() * 10;
        meteorsRef.current.push({
          id: uid(),
          x: r + Math.random() * (CW - r * 2),
          y: -30,
          r,
          vy: (1.8 + Math.random() * 2.1) * (1 + difficulty * 0.25),
        });
      }

      meteorsRef.current = meteorsRef.current
        .map((m) => ({ ...m, y: m.y + m.vy * (dt / 16) }))
        .filter((m) => m.y < CH + 50);

      let hit = false;
      for (const m of meteorsRef.current) {
        const ddx = m.x - p.x;
        const ddy = m.y - p.y;
        const rr = m.r + p.r;
        if (ddx * ddx + ddy * ddy <= rr * rr) {
          hit = true;
          break;
        }
      }

      if (hit) {
        setLives((lv) => {
          const next = lv - 1;
          if (next <= 0) {
            end();
            return 0;
          }
          return next;
        });
      }
    },
    [difficulty, end, gameOver, running]
  );

  useEffect(() => {
    let alive = true;
    function loop(t: number) {
      if (!alive) return;
      step(t);
      draw();
      rafRef.current = window.requestAnimationFrame(loop);
    }
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      alive = false;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [draw, step]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running && !gameOver) setRunning(true);
      if (e.key === "ArrowLeft") dirRef.current.x = -1;
      if (e.key === "ArrowRight") dirRef.current.x = 1;
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") dirRef.current.x = 0;
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [gameOver, running]);

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
      hint="Survive as long as you can. Dodge meteors to climb the leaderboard."
    >
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
        <canvas ref={canvasRef} width={CW} height={CH} className="block w-full h-auto touch-none" />
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <div className="bg-slate-900 border border-slate-800 rounded-xl py-4 text-xs font-bold text-center">MOVE</div>
        <div />

        <button
          type="button"
          onPointerDown={() => {
            dirRef.current.x = -1;
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (dirRef.current.x = 0)}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => (dirRef.current.x = 0)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-4 text-xs font-bold"
        >
          HOLD
        </button>
        <button
          type="button"
          onPointerDown={() => {
            dirRef.current.x = 1;
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (dirRef.current.x = 0)}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          →
        </button>
      </div>
    </RetroShell>
  );
}

