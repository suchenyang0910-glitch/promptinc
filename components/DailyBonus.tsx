"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { claimDailyBonus, getDailyBonusState } from "@/lib/retention/dailyBonus";

export default function DailyBonus({
  gameSlug,
  onClaim,
}: {
  gameSlug: string;
  onClaim: (reward: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  const [, forceRerender] = useState(0);
  const state = mounted ? getDailyBonusState(`daily_bonus:${gameSlug}`) : null;

  if (!state) return null;
  if (!state.canClaim) return null;

  return (
    <section className="bg-slate-900 rounded-2xl p-6 space-y-3 border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="font-bold">Daily Bonus</div>
        <div className="text-sm text-slate-400">Day {state.dayIndex}/7</div>
      </div>

      <div className="text-slate-300">Claim +${state.nextReward.toLocaleString()} for today.</div>

      <button
        type="button"
        onClick={() => {
          const res = claimDailyBonus(`daily_bonus:${gameSlug}`);
          if (!res) return;
          onClaim(res.reward);
          track("daily_bonus_claim", { game_slug: gameSlug, reward: res.reward, day: res.dayIndex });
          forceRerender((v) => v + 1);
        }}
        className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-3 font-bold"
      >
        Claim Daily Bonus
      </button>
    </section>
  );
}
