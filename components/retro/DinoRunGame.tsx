"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

const CW = 720;
const CH = 260;
const GROUND_Y = 210;
const DINO_X = 70;

type Obstacle = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "cactus_s" | "cactus_l" | "bird";
};

function uid() {
  return Math.random().toString(16).slice(2, 9) + Date.now().toString(16);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function DinoRunGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dinoRef = useRef({ y: GROUND_Y, vy: 0, w: 44, h: 48, onGround: true });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const lastSpawnRef = useRef(0);
  const lastStepRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const speedRef = useRef(6.5);
  const groundScrollRef = useRef(0);
  const frameTickRef = useRef(0);

  const speed = useMemo(() => 6.5 + Math.min(7.5, score / 250), [score]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    dinoRef.current = { y: GROUND_Y, vy: 0, w: 44, h: 48, onGround: true };
    obstaclesRef.current = [];
    lastSpawnRef.current = 0;
    lastStepRef.current = null;
    scoreRef.current = 0;
    speedRef.current = 6.5;
    groundScrollRef.current = 0;
    frameTickRef.current = 0;
  }, []);

  const end = useCallback(() => {
    setRunning(false);
    setGameOver(true);
  }, []);

  const jump = useCallback(() => {
    if (gameOver) return;
    const d = dinoRef.current;
    if (d.onGround) {
      d.vy = -13.5;
      d.onGround = false;
    }
    if (!running) setRunning(true);
  }, [gameOver, running]);

  const spawnObstacle = useCallback(() => {
    const now = performance.now();
    const minGap = 650 - Math.min(220, scoreRef.current / 6);
    if (now - lastSpawnRef.current < minGap) return;

    const roll = Math.random();
    let obs: Obstacle;
    if (roll < 0.45) {
      const h = 36 + Math.floor(Math.random() * 3) * 6;
      obs = { id: uid(), x: CW + 20, y: GROUND_Y - h + 48, w: 22, h, type: "cactus_s" };
    } else if (roll < 0.8) {
      obs = { id: uid(), x: CW + 20, y: GROUND_Y - 48, w: 34, h: 48, type: "cactus_l" };
    } else {
      const heights = [GROUND_Y - 48, GROUND_Y - 76, GROUND_Y - 104];
      const y = heights[Math.floor(Math.random() * heights.length)];
      obs = { id: uid(), x: CW + 20, y, w: 46, h: 30, type: "bird" };
    }
    obstaclesRef.current.push(obs);
    lastSpawnRef.current = now;
  }, []);

  const intersects = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
    const pad = 6;
    return (
      a.x + pad < b.x + b.w &&
      a.x + a.w - pad > b.x &&
      a.y + pad < b.y + b.h &&
      a.y + a.h - pad > b.y
    );
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== CW * dpr) {
      canvas.width = CW * dpr;
      canvas.height = CH * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, CW, CH);

    ctx.fillStyle = "#cbd5e1";
    for (let i = 0; i < 4; i++) {
      const cx = (i * 220 - (groundScrollRef.current * 0.15) % 220) + 80;
      ctx.beginPath();
      ctx.arc(cx, 70 + (i % 2) * 18, 18 + (i % 2) * 6, 0, Math.PI * 2);
      ctx.arc(cx + 18, 70 + (i % 2) * 18, 14 + (i % 2) * 4, 0, Math.PI * 2);
      ctx.arc(cx - 16, 70 + (i % 2) * 18, 12 + (i % 2) * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 2);
    ctx.lineTo(CW, GROUND_Y + 2);
    ctx.stroke();

    ctx.fillStyle = "#334155";
    for (let i = 0; i < 40; i++) {
      const px = ((i * 32) - (groundScrollRef.current % 32)) % CW;
      ctx.fillRect(px, GROUND_Y + 8, 8, 2);
    }

    const d = dinoRef.current;
    const dinoDrawX = DINO_X;
    const dinoDrawY = d.y;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(dinoDrawX, dinoDrawY, d.w, d.h);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(dinoDrawX + 32, dinoDrawY + 10, 6, 6);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(dinoDrawX + 34, dinoDrawY + 12, 3, 3);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(dinoDrawX - 4, dinoDrawY + 18, 14, 14);

    if (running && !gameOver) {
      const legFrame = Math.floor(frameTickRef.current / 6) % 2;
      ctx.fillStyle = "#0f172a";
      if (legFrame === 0) {
        ctx.fillRect(dinoDrawX + 6, dinoDrawY + 44, 10, 6);
        ctx.fillRect(dinoDrawX + 28, dinoDrawY + 48, 10, 4);
      } else {
        ctx.fillRect(dinoDrawX + 6, dinoDrawY + 48, 10, 4);
        ctx.fillRect(dinoDrawX + 28, dinoDrawY + 44, 10, 6);
      }
    } else {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(dinoDrawX + 6, dinoDrawY + 44, 10, 6);
      ctx.fillRect(dinoDrawX + 28, dinoDrawY + 44, 10, 6);
    }

    for (const o of obstaclesRef.current) {
      if (o.type === "bird") {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(o.x + 10, o.y + 10, 26, 12);
        ctx.fillRect(o.x, o.y, 12, 8);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(o.x + 10, o.y + 6, 6, 4);
        const flap = Math.floor(frameTickRef.current / 5) % 2;
        ctx.fillStyle = "#0f172a";
        if (flap === 0) {
          ctx.fillRect(o.x + 14, o.y + 2, 14, 8);
        } else {
          ctx.fillRect(o.x + 14, o.y + 18, 14, 8);
        }
      } else {
        ctx.fillStyle = "#15803d";
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = "#22c55e";
        if (o.type === "cactus_s") {
          ctx.fillRect(o.x - 6, o.y + 10, 6, 12);
          ctx.fillRect(o.x + o.w, o.y + 4, 6, 14);
        } else {
          ctx.fillRect(o.x - 8, o.y + 8, 8, 20);
          ctx.fillRect(o.x + o.w, o.y + 14, 8, 18);
        }
        ctx.fillStyle = "#052e16";
        ctx.fillRect(o.x + 4, o.y + 6, 3, o.h - 12);
      }
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "right";
    ctx.fillText(`HI ${String(Math.max(scoreRef.current, Number(localStorage.getItem(`best_score:${game.slug}`) ?? 0))).padStart(5, "0")}`, CW - 110, 28);
    ctx.fillText(String(Math.floor(scoreRef.current)).padStart(5, "0"), CW - 16, 28);
    ctx.textAlign = "left";
  }, [game.slug, gameOver, running]);

  const step = useCallback(
    (t: number) => {
      if (lastStepRef.current == null) lastStepRef.current = t;
      const dt = Math.min(32, t - lastStepRef.current);
      lastStepRef.current = t;
      frameTickRef.current += 1;

      if (running && !gameOver) {
        const d = dinoRef.current;
        const gravity = 0.65;
        d.vy += gravity;
        d.y += d.vy;
        if (d.y >= GROUND_Y) {
          d.y = GROUND_Y;
          d.vy = 0;
          d.onGround = true;
        }

        const currentSpeed = 6.5 + Math.min(7.5, scoreRef.current / 250);
        speedRef.current = currentSpeed;

        for (const o of obstaclesRef.current) {
          o.x -= currentSpeed * (dt / 16.67);
        }
        groundScrollRef.current += currentSpeed * (dt / 16.67);

        obstaclesRef.current = obstaclesRef.current.filter((o) => o.x + o.w > -20);

        spawnObstacle();

        const dinoBox = { x: DINO_X, y: d.y, w: d.w, h: d.h };
        for (const o of obstaclesRef.current) {
          if (intersects(dinoBox, o)) {
            end();
            break;
          }
        }

        scoreRef.current += 0.15 * (dt / 16.67);
        setScore(Math.floor(scoreRef.current));
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    },
    [draw, end, gameOver, running, spawnObstacle]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <RetroShell
      game={game}
      score={score}
      running={running}
      gameOver={gameOver}
      primaryLabel={running ? "Jump" : "Start Run"}
      onPrimary={jump}
      onReset={reset}
      hint="Tap / Click the game or press Space / ↑ to jump. Avoid cacti and birds."
    >
      <div className="flex justify-center">
        <button
          type="button"
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          className="relative w-full max-w-full rounded-xl border border-slate-800 bg-slate-50 touch-none select-none focus:outline-none"
          style={{ aspectRatio: `${CW} / ${CH}` }}
          aria-label="Dino Run game canvas"
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block", borderRadius: "0.75rem" }}
          />
        </button>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Speed: {speed.toFixed(1)}</span>
        <span>Obstacles: {obstaclesRef.current.length}</span>
      </div>
    </RetroShell>
  );
}
