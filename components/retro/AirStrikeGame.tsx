"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import {
  drawBullet,
  drawEnemyShip,
  drawFlame,
  drawPlayerShip,
  type EnemyShipKind,
  type PlayerShipKind,
} from "@/lib/retro/airstrikeSprites";
import type { GameConfig } from "@/types/game";

type Enemy = { id: string; x: number; y: number; vy: number; r: number; kind: EnemyShipKind };
type Bullet = { id: string; x: number; y: number; vy: number };
type Star = { x: number; y: number; r: number; vy: number; a: number };

const CW = 360;
const CH = 520;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function AirStrikeGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const playerRef = useRef({ x: CW / 2, y: CH - 80, r: 12 });
  const playerKindRef = useRef<PlayerShipKind>("arrow");
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const dirRef = useRef({ x: 0, y: 0 });
  const lastEnemyRef = useRef(0);
  const lastBulletRef = useRef(0);
  const starsRef = useRef<Star[]>([]);

  const difficulty = useMemo(() => 1 + Math.min(2.5, score / 120), [score]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    playerRef.current = { x: CW / 2, y: CH - 80, r: 12 };
    playerKindRef.current = Math.random() < 0.5 ? "arrow" : "delta";
    enemiesRef.current = [];
    bulletsRef.current = [];
    dirRef.current = { x: 0, y: 0 };
    lastEnemyRef.current = 0;
    lastBulletRef.current = 0;
    starsRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      r: 0.6 + Math.random() * 1.6,
      vy: 0.3 + Math.random() * 1.2,
      a: 0.25 + Math.random() * 0.65,
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
        r: 0.6 + Math.random() * 1.6,
        vy: 0.3 + Math.random() * 1.2,
        a: 0.25 + Math.random() * 0.65,
      }));
    }
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0b1224");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillText(`Lives: ${lives}`, 14, 22);

    const p = playerRef.current;
    ctx.save();
    ctx.translate(p.x, p.y);

    drawPlayerShip(ctx, playerKindRef.current);
    drawFlame(ctx);
    ctx.restore();

    bulletsRef.current.forEach((b) => {
      drawBullet(ctx, b.x, b.y);
    });

    enemiesRef.current.forEach((e) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      drawEnemyShip(ctx, e.kind);
      ctx.restore();
    });
  }, [lives]);

  const step = useCallback(
    (now: number) => {
      if (!running || gameOver) return;

      starsRef.current = starsRef.current.map((s) => {
        const ny = s.y + s.vy * (1 + difficulty * 0.25);
        return ny > CH + 10 ? { ...s, y: -10, x: Math.random() * CW } : { ...s, y: ny };
      });

      const p = playerRef.current;
      const d = dirRef.current;
      p.x = Math.max(p.r, Math.min(CW - p.r, p.x + d.x * 4.2));
      p.y = Math.max(p.r, Math.min(CH - p.r, p.y + d.y * 4.2));

      if (now - lastEnemyRef.current > 520 / difficulty) {
        lastEnemyRef.current = now;
        const roll = Math.random();
        const kind: EnemyShipKind = roll < 0.5 ? "dart" : roll < 0.8 ? "saucer" : "bomber";
        const r = kind === "saucer" ? 14 : 12;
        enemiesRef.current.push({
          id: uid(),
          x: 18 + Math.random() * (CW - 36),
          y: -20,
          vy: 1.4 + Math.random() * 1.4 * difficulty,
          r,
          kind,
        });
      }

      if (now - lastBulletRef.current > 220) {
        lastBulletRef.current = now;
        bulletsRef.current.push({ id: uid(), x: p.x, y: p.y - 18, vy: 5.8 });
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => ({ ...b, y: b.y - b.vy }))
        .filter((b) => b.y > -30);

      enemiesRef.current = enemiesRef.current
        .map((e) => ({ ...e, y: e.y + e.vy }))
        .filter((e) => e.y < CH + 40);

      const aliveEnemies: Enemy[] = [];
      let hitCount = 0;

      for (const e of enemiesRef.current) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= (e.r + p.r) * (e.r + p.r)) {
          hitCount += 1;
          continue;
        }
        aliveEnemies.push(e);
      }
      enemiesRef.current = aliveEnemies;

      if (hitCount) {
        setLives((lv) => {
          const next = lv - hitCount;
          if (next <= 0) {
            end();
            return 0;
          }
          return next;
        });
      }

      const newBullets: Bullet[] = [];
      const remainingEnemies: Enemy[] = [];
      const enemies = enemiesRef.current;

      for (const e of enemies) remainingEnemies.push(e);

      for (const b of bulletsRef.current) {
        let hit = false;
        for (let i = 0; i < remainingEnemies.length; i += 1) {
          const e = remainingEnemies[i];
          const dx = e.x - b.x;
          const dy = e.y - b.y;
          if (dx * dx + dy * dy <= (e.r + 4) * (e.r + 4)) {
            remainingEnemies.splice(i, 1);
            setScore((s) => s + 10);
            hit = true;
            break;
          }
        }
        if (!hit) newBullets.push(b);
      }
      bulletsRef.current = newBullets;
      enemiesRef.current = remainingEnemies;
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
      if (e.key === "ArrowUp") dirRef.current.y = -1;
      if (e.key === "ArrowDown") dirRef.current.y = 1;
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") dirRef.current.x = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") dirRef.current.y = 0;
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
      hint="Move to dodge enemies. Shooting is automatic."
    >
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
        <canvas ref={canvasRef} width={CW} height={CH} className="block w-full h-auto touch-none" />
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <button
          type="button"
          onPointerDown={() => {
            dirRef.current.y = -1;
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (dirRef.current.y = 0)}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          ↑
        </button>
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
          onPointerDown={() => {
            dirRef.current.x = 0;
            dirRef.current.y = 0;
          }}
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

        <div />
        <button
          type="button"
          onPointerDown={() => {
            dirRef.current.y = 1;
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (dirRef.current.y = 0)}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          ↓
        </button>
        <div />
      </div>
    </RetroShell>
  );
}
