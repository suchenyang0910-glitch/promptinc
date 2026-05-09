"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Brick = { x: number; y: number; alive: boolean };

const CW = 360;
const CH = 520;

const BRICK_SPEC = { cols: 8, rows: 6, w: 38, h: 16, gap: 6, top: 70, left: 22 };

function buildBricks() {
  const arr: Brick[] = [];
  for (let r = 0; r < BRICK_SPEC.rows; r += 1) {
    for (let c = 0; c < BRICK_SPEC.cols; c += 1) {
      arr.push({
        x: BRICK_SPEC.left + c * (BRICK_SPEC.w + BRICK_SPEC.gap),
        y: BRICK_SPEC.top + r * (BRICK_SPEC.h + BRICK_SPEC.gap),
        alive: true,
      });
    }
  }
  return arr;
}

export default function BrickBreakerGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const paddleRef = useRef({ x: CW / 2, w: 90 });
  const ballRef = useRef({ x: CW / 2, y: CH - 120, vx: 2.6, vy: -3.2, r: 7 });
  const bricksRef = useRef<Brick[]>(buildBricks());

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    paddleRef.current = { x: CW / 2, w: 90 };
    ballRef.current = { x: CW / 2, y: CH - 120, vx: 2.6, vy: -3.2, r: 7 };
    bricksRef.current = buildBricks();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui";
    ctx.fillText(`Lives: ${lives}`, 14, 22);

    const paddle = paddleRef.current;
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(paddle.x - paddle.w / 2, CH - 60, paddle.w, 12);

    const ball = ballRef.current;
    ctx.beginPath();
    ctx.fillStyle = "#22c55e";
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    bricksRef.current.forEach((b, idx) => {
      if (!b.alive) return;
      const row = Math.floor(idx / BRICK_SPEC.cols);
      const hue = 210 + row * 12;
      ctx.fillStyle = `hsl(${hue} 80% 60%)`;
      ctx.fillRect(b.x, b.y, BRICK_SPEC.w, BRICK_SPEC.h);
    });
  }, [lives]);

  const loseLife = useCallback(() => {
    setLives((lv) => {
      const next = lv - 1;
      if (next <= 0) {
        setRunning(false);
        setGameOver(true);
        return 0;
      }
      ballRef.current = { x: CW / 2, y: CH - 120, vx: 2.6, vy: -3.2, r: 7 };
      paddleRef.current = { ...paddleRef.current, x: CW / 2 };
      return next;
    });
  }, []);

  const step = useCallback(() => {
    if (!running || gameOver) return;
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.r <= 0 || ball.x + ball.r >= CW) ball.vx *= -1;
    if (ball.y - ball.r <= 0) ball.vy *= -1;

    const py = CH - 60;
    const withinPaddle = ball.y + ball.r >= py && ball.y + ball.r <= py + 12;
    if (withinPaddle && ball.x >= paddle.x - paddle.w / 2 && ball.x <= paddle.x + paddle.w / 2 && ball.vy > 0) {
      const hit = (ball.x - paddle.x) / (paddle.w / 2);
      ball.vx = 3.2 * hit;
      ball.vy *= -1;
    }

    bricksRef.current.forEach((b) => {
      if (!b.alive) return;
      const hitX = ball.x >= b.x - ball.r && ball.x <= b.x + BRICK_SPEC.w + ball.r;
      const hitY = ball.y >= b.y - ball.r && ball.y <= b.y + BRICK_SPEC.h + ball.r;
      if (!hitX || !hitY) return;
      b.alive = false;
      ball.vy *= -1;
      setScore((s) => s + 10);
    });

    const remaining = bricksRef.current.some((b) => b.alive);
    if (!remaining) {
      setRunning(false);
      setGameOver(true);
      return;
    }

    if (ball.y - ball.r > CH) {
      loseLife();
      return;
    }
  }, [gameOver, loseLife, running]);

  useEffect(() => {
    let alive = true;
    function loop() {
      if (!alive) return;
      step();
      draw();
      rafRef.current = window.requestAnimationFrame(loop);
    }
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      alive = false;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [draw, step]);

  const movePaddleTo = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CW;
    paddleRef.current.x = Math.max(paddleRef.current.w / 2, Math.min(CW - paddleRef.current.w / 2, x));
  }, []);

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
      hint="Desktop: move mouse. Mobile: drag or tap buttons."
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        onMouseMove={(e) => movePaddleTo(e.clientX)}
        onTouchMove={(e) => movePaddleTo(e.touches[0]?.clientX ?? 0)}
        className="mx-auto border border-slate-700 rounded-xl touch-none"
      />

      <div className="flex gap-3 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => {
            paddleRef.current.x = Math.max(paddleRef.current.w / 2, paddleRef.current.x - 40);
          }}
          className="flex-1 bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            paddleRef.current.x = Math.min(CW - paddleRef.current.w / 2, paddleRef.current.x + 40);
          }}
          className="flex-1 bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          →
        </button>
      </div>
    </RetroShell>
  );
}
