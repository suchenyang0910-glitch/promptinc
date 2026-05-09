"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Coin = { id: string; x: number; y: number; vy: number };

const CW = 360;
const CH = 520;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function CoinCatcherGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);

  const playerRef = useRef({ x: CW / 2, w: 90 });
  const coinsRef = useRef<Coin[]>([]);
  const lastSpawnRef = useRef(0);
  const moveDirRef = useRef<"L" | "R" | "N">("N");

  const speed = useMemo(() => 1 + Math.min(2.2, score / 80), [score]);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setScore(0);
    setMisses(0);
    playerRef.current = { x: CW / 2, w: 90 };
    coinsRef.current = [];
    lastSpawnRef.current = 0;
    moveDirRef.current = "N";
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
    ctx.fillText(`Misses: ${misses}/5`, 14, 22);

    const p = playerRef.current;
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(p.x - p.w / 2, CH - 64, p.w, 14);

    coinsRef.current.forEach((c) => {
      ctx.beginPath();
      ctx.fillStyle = "#fbbf24";
      ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [misses]);

  const step = useCallback(
    (now: number) => {
      if (!running || gameOver) return;
      const p = playerRef.current;

      if (moveDirRef.current === "L") p.x = Math.max(p.w / 2, p.x - 5.5);
      if (moveDirRef.current === "R") p.x = Math.min(CW - p.w / 2, p.x + 5.5);

      if (now - lastSpawnRef.current > 650) {
        lastSpawnRef.current = now;
        coinsRef.current.push({
          id: uid(),
          x: 18 + Math.random() * (CW - 36),
          y: -10,
          vy: (2.1 + Math.random() * 1.2) * speed,
        });
      }

      const caughtY = CH - 64;
      const nextCoins: Coin[] = [];
      let caught = 0;
      let missed = 0;

      for (const c of coinsRef.current) {
        const ny = c.y + c.vy;
        const hit = ny >= caughtY - 10 && ny <= caughtY + 14 && c.x >= p.x - p.w / 2 && c.x <= p.x + p.w / 2;
        if (hit) {
          caught += 1;
          continue;
        }
        if (ny > CH + 20) {
          missed += 1;
          continue;
        }
        nextCoins.push({ ...c, y: ny });
      }
      coinsRef.current = nextCoins;

      if (caught) setScore((s) => s + caught);
      if (missed) {
        setMisses((m) => {
          const next = m + missed;
          if (next >= 5) {
            setRunning(false);
            setGameOver(true);
          }
          return next;
        });
      }
    },
    [gameOver, running, speed]
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
      if (e.key === "ArrowLeft") moveDirRef.current = "L";
      if (e.key === "ArrowRight") moveDirRef.current = "R";
      if (!running && (e.key === "ArrowLeft" || e.key === "ArrowRight")) setRunning(true);
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") moveDirRef.current = "N";
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [running]);

  const moveTo = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CW;
    const p = playerRef.current;
    p.x = Math.max(p.w / 2, Math.min(CW - p.w / 2, x));
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
      hint="Catch coins. Miss 5 times and it’s over."
    >
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onMouseMove={(e) => moveTo(e.clientX)}
          onTouchMove={(e) => moveTo(e.touches[0]?.clientX ?? 0)}
          className="block w-full h-auto touch-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = "L";
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (moveDirRef.current = "N")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = "R";
            if (!running) setRunning(true);
          }}
          onPointerUp={() => (moveDirRef.current = "N")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-4 text-2xl"
        >
          →
        </button>
      </div>
    </RetroShell>
  );
}
