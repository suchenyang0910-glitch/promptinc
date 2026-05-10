"use client";

import { useState } from "react";

import { submitScore as submitScoreApi } from "@/lib/leaderboard";
import { track } from "@/lib/analytics";

export default function SubmitScore({
  gameSlug,
  score,
  onSubmitted,
}: {
  gameSlug: string;
  score: number;
  onSubmitted: () => void;
}) {
  const [playerName, setPlayerName] = useState(() => {
    try {
      return window.localStorage.getItem("player_name") ?? "";
    } catch {
      return "";
    }
  });
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;

    const name = playerName.trim().slice(0, 20);
    if (!name) {
      setMessage("Please enter your name.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const result = await submitScoreApi(gameSlug, name, score);

    if (!result.ok) {
      setMessage(result.error || "Submit failed.");
      setSubmitting(false);
      return;
    }

    setPlayerName("");
    try {
      window.localStorage.setItem("player_name", name);
    } catch {
      // ignore
    }
    setSubmitting(false);
    setMessage("Score submitted!");
    track("score_submit", { game_slug: gameSlug, score: Math.floor(score) });
    onSubmitted();
  }

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-bold">Submit Score</h2>

      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl p-3 bg-slate-800 border border-slate-700"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-xl py-3 font-bold"
      >
        Submit {Math.floor(score).toLocaleString()}
      </button>

      {message ? <p className="text-slate-400">{message}</p> : null}
    </section>
  );
}
