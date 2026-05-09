"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

import {
  TETRIS_CELL as CELL,
  TETRIS_H as H,
  TETRIS_W as W,
  clearLines,
  collides,
  drawTetris,
  emptyBoard,
  newPiece,
  stamp,
  type Piece,
} from "@/lib/retro/tetris";

type Dir = "LEFT" | "RIGHT" | "DOWN";


export default function TetrisGame({ game }: { game: GameConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<number[][]>(() => emptyBoard());
  const [piece, setPiece] = useState<Piece | null>(() => newPiece());
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const speed = useMemo(() => {
    const base = 520;
    const lvl = Math.min(8, Math.floor(score / 600));
    return Math.max(140, base - lvl * 45);
  }, [score]);

  const doReset = useCallback(() => {
    setBoard(emptyBoard());
    setPiece(newPiece());
    setScore(0);
    setRunning(false);
    setGameOver(false);
  }, []);

  const end = useCallback(() => {
    setRunning(false);
    setGameOver(true);
  }, []);

  const tryMove = useCallback(
    (dir: Dir) => {
      if (!piece || gameOver) return;
      const next: Piece = { ...piece };
      if (dir === "LEFT") next.x -= 1;
      if (dir === "RIGHT") next.x += 1;
      if (dir === "DOWN") next.y += 1;
      if (!collides(board, next)) setPiece(next);
    },
    [board, gameOver, piece]
  );

  const rotate = useCallback(() => {
    if (!piece || gameOver) return;
    const next: Piece = { ...piece, rot: (piece.rot + 1) % piece.shape.length };
    if (!collides(board, next)) {
      setPiece(next);
      return;
    }
    const kicks = [-1, 1, -2, 2];
    for (const k of kicks) {
      const kicked: Piece = { ...next, x: next.x + k };
      if (!collides(board, kicked)) {
        setPiece(kicked);
        return;
      }
    }
  }, [board, gameOver, piece]);

  const hardDrop = useCallback(() => {
    if (!piece || gameOver) return;
    let next = { ...piece };
    while (!collides(board, { ...next, y: next.y + 1 })) {
      next = { ...next, y: next.y + 1 };
      setScore((s) => s + 1);
    }
    setPiece(next);
  }, [board, gameOver, piece]);

  const lockAndSpawn = useCallback(() => {
    if (!piece) return;
    const stamped = stamp(board, piece);
    const { board: clearedBoard, cleared } = clearLines(stamped);
    if (cleared > 0) setScore((s) => s + 100 * cleared * cleared);
    const next = newPiece();
    if (collides(clearedBoard, next)) {
      setBoard(clearedBoard);
      setPiece(null);
      end();
      return;
    }
    setBoard(clearedBoard);
    setPiece(next);
  }, [board, end, piece]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawTetris(canvas, board, piece);
  }, [board, piece]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (gameOver) doReset();
        setRunning((v) => !v);
        return;
      }

      if (!running) return;
      if (e.key === "ArrowLeft") tryMove("LEFT");
      if (e.key === "ArrowRight") tryMove("RIGHT");
      if (e.key === "ArrowDown") tryMove("DOWN");
      if (e.key === "ArrowUp") rotate();
      if (e.key === " ") hardDrop();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doReset, gameOver, hardDrop, rotate, running, tryMove]);

  useEffect(() => {
    if (!running || gameOver) return;
    const timer = window.setInterval(() => {
      if (!piece) return;
      const next: Piece = { ...piece, y: piece.y + 1 };
      if (!collides(board, next)) {
        setPiece(next);
        return;
      }
      lockAndSpawn();
    }, speed);
    return () => window.clearInterval(timer);
  }, [board, gameOver, lockAndSpawn, piece, running, speed]);

  const primaryLabel = running ? "Pause" : game.clickButtonText;

  return (
    <RetroShell
      game={game}
      score={score}
      running={running}
      gameOver={gameOver}
      primaryLabel={primaryLabel}
      onPrimary={() => {
        if (gameOver) doReset();
        setRunning((v) => !v);
      }}
      onReset={doReset}
      hint="Desktop: arrows + space. Mobile: use buttons."
    >
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-700">
        <canvas ref={canvasRef} width={W * CELL} height={H * CELL} className="block w-full h-auto" />
      </div>

      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => tryMove("LEFT")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-3 text-xl"
        >
          ←
        </button>
        <button
          type="button"
          onClick={rotate}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-3 text-sm font-bold"
        >
          Rotate
        </button>
        <button
          type="button"
          onClick={() => tryMove("RIGHT")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-3 text-xl"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => tryMove("DOWN")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl py-3 text-xl"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={hardDrop}
          className="bg-purple-700 hover:bg-purple-600 rounded-xl py-3 text-sm font-bold"
        >
          Drop
        </button>
      </div>
    </RetroShell>
  );
}
