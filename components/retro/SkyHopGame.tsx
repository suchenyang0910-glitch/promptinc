"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const CW = 360;
const CH = 520;

type Pipe = {
  id: string;
  x: number;
  gapY: number;
  passed: boolean;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function SkyHopGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const birdRef = useRef({ x: 120, y: CH / 2, vy: 0, r: 14 });
  const pipesRef = useRef<Pipe[]>([]);
  const lastPipeRef = useRef(0);
  const lastStepRef = useRef<number | null>(null);
  const flapQueuedRef = useRef(false);

  const difficulty = useMemo(() => 1 + Math.min(2.2, score / 18), [score]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    birdRef.current = { x: 120, y: CH / 2, vy: 0, r: 14 };
    pipesRef.current = [];
    lastPipeRef.current = 0;
    lastStepRef.current = null;
    flapQueuedRef.current = false;
  }, []);

  const end = useCallback(() => {
    setRunning(false);
    setGameOver(true);
  }, []);

  const queueFlap = useCallback(() => {
    if (gameOver) return;
    flapQueuedRef.current = true;
    if (!running) setRunning(true);
  }, [gameOver, running]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0b1224");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, CH - 60, CW, 60);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, CH - 60, CW, 2);

    const pipeW = 64;
    const gapH = clamp(180 - score * 2, 120, 180);
    const pipeColor = "#22c55e";
    const pipeEdge = "#86efac";
    const pipeDark = "#15803d";

    for (const p of pipesRef.current) {
      const topH = Math.max(0, p.gapY - gapH / 2);
      const bottomY = p.gapY + gapH / 2;
      const bottomH = Math.max(0, CH - 60 - bottomY);

      ctx.fillStyle = pipeDark;
      ctx.fillRect(p.x + 6, 0, pipeW, topH);
      ctx.fillRect(p.x + 6, bottomY, pipeW, bottomH);

      ctx.fillStyle = pipeColor;
      ctx.fillRect(p.x, 0, pipeW, topH);
      ctx.fillRect(p.x, bottomY, pipeW, bottomH);

      ctx.strokeStyle = pipeEdge;
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x + 1, 1, pipeW - 2, Math.max(0, topH - 2));
      ctx.strokeRect(p.x + 1, bottomY + 1, pipeW - 2, Math.max(0, bottomH - 2));
    }

    const b = birdRef.current;
    ctx.save();
    ctx.translate(b.x, b.y);
    const tilt = clamp(b.vy / 10, -0.8, 0.8);
    ctx.rotate(tilt);
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(5, -4, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(18, 3);
    ctx.lineTo(10, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (!running && !gameOver) {
      ctx.fillStyle = "rgba(148,163,184,0.95)";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Tap / Space to hop", CW / 2, CH / 2 - 20);
      ctx.fillText("Avoid the pipes", CW / 2, CH / 2 + 4);
    }
  }, [gameOver, running, score]);

  const step = useCallback(
    (now: number) => {
      if (!running || gameOver) return;
      const prev = lastStepRef.current;
      lastStepRef.current = now;
      const dt = prev ? Math.min(34, now - prev) : 16;

      const gravity = 0.0018;
      const flapImpulse = -0.52;
      const speed = 0.14 + 0.055 * difficulty;
      const pipeEvery = 1350 / difficulty;
      const pipeW = 64;
      const gapH = clamp(180 - score * 2, 120, 180);
      const gapPad = 40;

      if (flapQueuedRef.current) {
        flapQueuedRef.current = false;
        birdRef.current.vy = flapImpulse;
      }

      const b = birdRef.current;
      b.vy = clamp(b.vy + gravity * dt, -1.1, 1.1);
      b.y = b.y + b.vy * dt * 1.8;

      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy = 0;
      }
      if (b.y + b.r > CH - 60) {
        end();
        return;
      }

      if (now - lastPipeRef.current > pipeEvery) {
        lastPipeRef.current = now;
        const gapY = gapPad + gapH / 2 + Math.random() * (CH - 60 - gapPad * 2 - gapH);
        pipesRef.current.push({ id: uid(), x: CW + 30, gapY, passed: false });
      }

      pipesRef.current = pipesRef.current
        .map((p) => ({ ...p, x: p.x - speed * dt * 60 }))
        .filter((p) => p.x > -pipeW - 30);

      let gained = 0;
      pipesRef.current = pipesRef.current.map((p) => {
        if (!p.passed && p.x + pipeW < b.x - b.r) {
          gained += 1;
          return { ...p, passed: true };
        }
        return p;
      });
      if (gained) setScore((s) => s + gained);

      for (const p of pipesRef.current) {
        const inX = b.x + b.r > p.x && b.x - b.r < p.x + pipeW;
        if (!inX) continue;
        const topH = p.gapY - gapH / 2;
        const bottomY = p.gapY + gapH / 2;
        const hitTop = b.y - b.r < topH;
        const hitBottom = b.y + b.r > bottomY;
        if (hitTop || hitBottom) {
          end();
          return;
        }
      }
    },
    [difficulty, end, gameOver, running, score]
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
      if (e.key === " " || e.key === "Spacebar" || e.key === "ArrowUp") queueFlap();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queueFlap]);

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
      hint="Tap or press Space to hop. Pass pipes to score."
    >
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
        <button
          type="button"
          onClick={queueFlap}
          onPointerDown={queueFlap}
          className="block w-full"
        >
          <canvas ref={canvasRef} width={CW} height={CH} className="block w-full h-auto touch-none" />
        </button>
      </div>

      <button
        type="button"
        onClick={queueFlap}
        className="mx-auto w-full max-w-[360px] bg-slate-800 hover:bg-slate-700 rounded-xl py-4 font-bold"
      >
        Hop
      </button>
    </RetroShell>
  );
}
