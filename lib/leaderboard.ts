"use client";

const API_BASE =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}/api/leaderboard`
    : "https://promptinc.app/api/leaderboard";

export type ScoreEntry = {
  id: number;
  game_slug: string;
  player_name: string;
  score: number;
  created_at: string;
};

export async function submitScore(
  gameSlug: string,
  playerName: string,
  score: number
): Promise<{ id: number; created_at: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_slug: gameSlug, player_name: playerName, score: Math.floor(score) }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getTopScores(
  gameSlug: string,
  limit = 30
): Promise<ScoreEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/top?game_slug=${encodeURIComponent(gameSlug)}&limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getMyBest(
  gameSlug: string,
  playerName: string
): Promise<number> {
  try {
    const res = await fetch(
      `${API_BASE}/my-best?game_slug=${encodeURIComponent(gameSlug)}&player_name=${encodeURIComponent(playerName.slice(0, 20))}`
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.best ?? 0;
  } catch {
    return 0;
  }
}
