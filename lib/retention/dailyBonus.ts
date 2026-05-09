export type DailyBonusState = {
  canClaim: boolean;
  dayIndex: number;
  streak: number;
  nextReward: number;
};

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getDailyBonusState(storageKey = "daily_bonus"):
  | DailyBonusState
  | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    const data = raw ? (JSON.parse(raw) as { lastClaim?: string; streak?: number } | null) : null;
    const lastClaim = typeof data?.lastClaim === "string" ? data.lastClaim : "";
    const streakRaw = Number(data?.streak ?? 0);
    const streak = Number.isFinite(streakRaw) ? streakRaw : 0;

    const today = todayKey();
    const canClaim = lastClaim !== today;

    const nextStreak = canClaim ? Math.min(7, Math.max(1, streak + 1)) : Math.min(7, Math.max(1, streak));
    const rewardTable = [100, 300, 600, 1000, 1500, 2200, 3500];
    const nextReward = rewardTable[nextStreak - 1] ?? 100;

    return {
      canClaim,
      dayIndex: nextStreak,
      streak: nextStreak,
      nextReward,
    };
  } catch {
    return null;
  }
}

export function claimDailyBonus(storageKey = "daily_bonus"):
  | { reward: number; dayIndex: number; streak: number }
  | null {
  if (typeof window === "undefined") return null;

  try {
    const state = getDailyBonusState(storageKey);
    if (!state?.canClaim) return null;

    const today = todayKey();
    const next = {
      lastClaim: today,
      streak: state.streak,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(next));

    return { reward: state.nextReward, dayIndex: state.dayIndex, streak: state.streak };
  } catch {
    return null;
  }
}
