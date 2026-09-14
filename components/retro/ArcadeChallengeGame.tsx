"use client";

import { useCallback, useEffect, useState } from "react";

import RetroShell from "@/components/retro/RetroShell";
import type { GameConfig } from "@/types/game";

type Question = { prompt: string; answers: number[]; correct: number };

function randomQuestion(): Question {
  const left = 3 + Math.floor(Math.random() * 18);
  const right = 2 + Math.floor(Math.random() * 12);
  const add = Math.random() > 0.5;
  const correct = add ? left + right : left - right;
  const options = new Set([correct]);
  while (options.size < 4) options.add(correct + Math.floor(Math.random() * 13) - 6 || correct + 1);
  return { prompt: `${left} ${add ? "+" : "−"} ${right} = ?`, answers: [...options].sort(() => Math.random() - 0.5), correct };
}

function randomTarget() {
  return { x: 10 + Math.floor(Math.random() * 76), y: 12 + Math.floor(Math.random() * 70) };
}

function randomHole() {
  return Math.floor(Math.random() * 9);
}

export default function ArcadeChallengeGame({ game }: { game: GameConfig }) {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeHole, setActiveHole] = useState(0);
  const [question, setQuestion] = useState<Question>(randomQuestion);
  const [target, setTarget] = useState(randomTarget);

  const reset = useCallback(() => {
    setRunning(false);
    setGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setActiveHole(randomHole());
    setQuestion(randomQuestion());
    setTarget(randomTarget());
  }, []);

  const startOrPause = useCallback(() => {
    if (gameOver) reset();
    setRunning((value) => !value);
  }, [gameOver, reset]);

  useEffect(() => {
    if (!running || gameOver) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setRunning(false);
          setGameOver(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameOver, running]);

  useEffect(() => {
    if (!running || gameOver || game.gameType !== "mole_rush") return;
    const mover = window.setInterval(() => setActiveHole(Math.floor(Math.random() * 9)), 650);
    return () => window.clearInterval(mover);
  }, [game.gameType, gameOver, running]);

  useEffect(() => {
    if (!running || gameOver || game.gameType !== "target_blaster") return;
    const mover = window.setInterval(() => setTarget(randomTarget()), 850);
    return () => window.clearInterval(mover);
  }, [game.gameType, gameOver, running]);

  const award = useCallback(() => {
    setScore((value) => value + 20 + Math.min(streak * 3, 30));
    setStreak((value) => value + 1);
  }, [streak]);

  const hitMole = useCallback((index: number) => {
    if (!running || index !== activeHole) return;
    award();
    setActiveHole(randomHole());
  }, [activeHole, award, running]);

  const answer = useCallback((value: number) => {
    if (!running) return;
    if (value === question.correct) award();
    else setStreak(0);
    setQuestion(randomQuestion());
  }, [award, question.correct, running]);

  const hitTarget = useCallback(() => {
    if (!running) return;
    award();
    setTarget(randomTarget());
  }, [award, running]);

  const primaryLabel = running ? "Pause" : game.clickButtonText;
  const modeHint = game.gameType === "mole_rush"
    ? "Tap the mole before it moves. Each hit builds a score bonus."
    : game.gameType === "math_sprint"
      ? "Choose the correct answer quickly. Correct streaks earn bonus points."
      : "Hit the glowing target before it relocates. Consecutive hits earn bonus points.";

  return (
    <RetroShell game={game} score={score} running={running} gameOver={gameOver} primaryLabel={primaryLabel} onPrimary={startOrPause} onReset={reset} hint={modeHint}>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Time: {timeLeft}s</span><span>Streak: {streak}</span>
      </div>

      {game.gameType === "mole_rush" ? (
        <div className="grid grid-cols-3 gap-3 mx-auto max-w-[520px]" aria-label="Mole Rush board">
          {Array.from({ length: 9 }, (_, index) => {
            const isMole = running && index === activeHole;
            return <button key={index} type="button" data-testid={isMole ? "mole-target" : undefined} onClick={() => hitMole(index)} className="aspect-square rounded-2xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-4xl" aria-label={isMole ? "Tap mole" : `Empty hole ${index + 1}`}>{isMole ? "🐹" : "◌"}</button>;
          })}
        </div>
      ) : null}

      {game.gameType === "math_sprint" ? (
        <div className="mx-auto max-w-[520px] rounded-2xl border border-slate-700 bg-slate-950 p-6 space-y-5">
          <div className="text-4xl font-bold" data-testid="math-question">{question.prompt}</div>
          <div className="grid grid-cols-2 gap-3">
            {question.answers.map((value) => <button key={value} type="button" data-testid="math-answer" onClick={() => answer(value)} className="rounded-xl bg-slate-800 hover:bg-blue-700 py-4 text-xl font-bold">{value}</button>)}
          </div>
        </div>
      ) : null}

      {game.gameType === "target_blaster" ? (
        <div className="relative mx-auto h-[340px] w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950" aria-label="Target Blaster board">
          {running ? <button type="button" data-testid="blaster-target" onClick={hitTarget} aria-label="Hit target" className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-100 bg-cyan-500 shadow-[0_0_28px_rgba(34,211,238,0.9)] w-16 h-16" style={{ left: `${target.x}%`, top: `${target.y}%` }}>◎</button> : <div className="absolute inset-0 flex items-center justify-center text-slate-400">Press Start to begin</div>}
        </div>
      ) : null}
    </RetroShell>
  );
}
