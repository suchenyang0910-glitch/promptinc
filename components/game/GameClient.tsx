"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import Leaderboard from "@/components/Leaderboard";
import DailyBonus from "@/components/DailyBonus";
import ShareButton from "@/components/ShareButton";
import SubmitScore from "@/components/SubmitScore";
import { track } from "@/lib/analytics";
import {
  buildHydratedState,
  calcIncomePerSecond,
  calcUpgradeCost,
  formatMoney,
  gameReducer,
  getSaveKey,
  makeDefaultUpgrades,
  tryParseSave,
  type SaveData,
} from "@/lib/gameEngine";
import type { GameConfig } from "@/types/game";

export default function GameClient({ config }: { config: GameConfig }) {
  const saveKey = useMemo(() => getSaveKey(config), [config]);
  const reducer = useMemo(() => gameReducer(config), [config]);

  const [state, dispatch] = useReducer(reducer, {
    money: 0,
    clickPower: 1,
    upgrades: makeDefaultUpgrades(config),
    offlineEarnings: 0,
  });

  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  const [luckMessage, setLuckMessage] = useState("");
  const [chestVisible, setChestVisible] = useState(false);
  const [incomeMultiplier, setIncomeMultiplier] = useState(1);
  const incomeMultiplierRef = useRef(1);
  const clearLuckTimerRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const incomePerSecond = useMemo(() => calcIncomePerSecond(state.upgrades), [state.upgrades]);
  const effectiveIncomePerSecond = useMemo(
    () => incomePerSecond * incomeMultiplier,
    [incomeMultiplier, incomePerSecond]
  );
  const nextMilestone = useMemo(() => {
    return config.milestones.find((m) => state.money < m.money) ?? config.milestones[config.milestones.length - 1];
  }, [config.milestones, state.money]);

  const progress = useMemo(() => {
    const target = nextMilestone.money;
    const pct = target > 0 ? Math.min(1, Math.max(0, state.money / target)) : 0;
    return Math.round(pct * 100);
  }, [nextMilestone.money, state.money]);

  const achievements = useMemo(
    () => [
      { id: "money_1k", title: "First $1K", unlocked: state.money >= 1000 },
      { id: "money_10k", title: "Seed Investor", unlocked: state.money >= 10000 },
      { id: "upgrade_10", title: "Team Builder", unlocked: (state.upgrades[0]?.count ?? 0) >= 10 },
      { id: "upgrade_5", title: "Infrastructure", unlocked: (state.upgrades[1]?.count ?? 0) >= 5 },
      { id: "income_100", title: "$100/sec", unlocked: incomePerSecond >= 100 },
      { id: "income_1000", title: "$1K/sec", unlocked: incomePerSecond >= 1000 },
    ],
    [incomePerSecond, state.money, state.upgrades]
  );

  useEffect(() => {
    const saved = tryParseSave(localStorage.getItem(saveKey));
    dispatch({ type: "hydrate", payload: buildHydratedState(config, saved) });
  }, [config, saveKey]);

  useEffect(() => {
    track("game_view", { game_slug: config.slug, game_type: config.gameType, category: config.category });
  }, [config.category, config.gameType, config.slug]);

  useEffect(() => {
    const timer = window.setInterval(
      () => dispatch({ type: "tick", multiplier: incomeMultiplierRef.current }),
      1000
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    incomeMultiplierRef.current = incomeMultiplier;
  }, [incomeMultiplier]);

  useEffect(() => {
    if (!config.luck?.enabled) return;
    const t = window.setInterval(() => {
      setChestVisible(true);
    }, 60000);
    return () => window.clearInterval(t);
  }, [config.luck?.enabled]);

  useEffect(() => {
    const save: SaveData = {
      money: state.money,
      clickPower: state.clickPower,
      upgrades: state.upgrades.map((u) => ({ id: u.id, count: u.count })),
      lastSaveTime: Date.now(),
    };
    localStorage.setItem(saveKey, JSON.stringify(save));
  }, [saveKey, state.clickPower, state.money, state.upgrades]);

  useEffect(() => {
    return () => {
      if (clearLuckTimerRef.current) window.clearTimeout(clearLuckTimerRef.current);
    };
  }, []);

  function showLuckMessage(message: string, ms = 1500) {
    setLuckMessage(message);
    if (clearLuckTimerRef.current) window.clearTimeout(clearLuckTimerRef.current);
    clearLuckTimerRef.current = window.setTimeout(() => setLuckMessage(""), ms);
  }

  function handleClick() {
    if (!startedRef.current) {
      startedRef.current = true;
      track("game_start", { game_slug: config.slug });
    }
    const clickPower = state.clickPower;
    let reward = clickPower;
    const luck = config.luck;

    if (luck?.enabled) {
      const isLucky = Math.random() < luck.criticalChance;
      if (isLucky) {
        reward = clickPower * luck.criticalMultiplier;
        const name = luck.luckyNames[Math.floor(Math.random() * luck.luckyNames.length)] ?? "Lucky Bonus";
        showLuckMessage(`🔥 ${name} +$${Math.floor(reward).toLocaleString()}`, 1500);
      }
    }

    dispatch({ type: "add_money", amount: reward });
  }

  function openLuckyChest() {
    setChestVisible(false);

    const roll = Math.random();
    const baseIncome = incomePerSecond;

    if (roll < 0.6) {
      const bonus = Math.max(100, baseIncome * 30);
      dispatch({ type: "add_money", amount: bonus });
      showLuckMessage(`🎁 Lucky Chest +$${Math.floor(bonus).toLocaleString()}`, 2000);
      return;
    }

    if (roll < 0.9) {
      setIncomeMultiplier(2);
      showLuckMessage("⚡ Double Income for 30 seconds", 2000);
      window.setTimeout(() => {
        if (incomeMultiplierRef.current === 2) setIncomeMultiplier(1);
      }, 30000);
      return;
    }

    const jackpot = Math.max(1000, baseIncome * 120);
    dispatch({ type: "add_money", amount: jackpot });
    showLuckMessage(`💎 Jackpot +$${Math.floor(jackpot).toLocaleString()}`, 2000);
  }

  function resetGame() {
    localStorage.removeItem(saveKey);
    track("game_reset", { game_slug: config.slug });
    dispatch({ type: "reset" });
  }

  return (
    <section className="space-y-6">
      <section className="bg-slate-900 rounded-2xl p-6 text-center space-y-4">
        <div className="text-sm font-semibold tracking-wide text-slate-400">{config.currencyName.toUpperCase()}</div>
        <div className="text-5xl font-bold" data-testid="idle-money">
          ${formatMoney(state.money)}
        </div>
        <div className="text-slate-400">Revenue: ${formatMoney(effectiveIncomePerSecond)} / sec</div>

        {incomeMultiplier > 1 ? (
          <div className="text-yellow-400 font-bold">⚡ Income Boost x{incomeMultiplier}</div>
        ) : null}

        {luckMessage ? <div className="text-yellow-400 font-bold text-xl animate-pulse">{luckMessage}</div> : null}

        {state.offlineEarnings > 0 ? (
          <div className="text-sm text-emerald-300">
            Offline earnings: +${formatMoney(state.offlineEarnings)} (capped at 1 hour)
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleClick}
          data-testid="idle-click"
          className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 text-xl font-bold"
        >
          {config.clickButtonText} +${state.clickPower}
        </button>

        {config.luck?.enabled && chestVisible ? (
          <button
            type="button"
            onClick={openLuckyChest}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl py-4 text-xl font-bold animate-pulse"
          >
            🎁 Open Lucky Chest
          </button>
        ) : null}
      </section>

      <ShareButton gameSlug={config.slug} />

      <SubmitScore
        gameSlug={config.slug}
        score={state.money}
        onSubmitted={() => setLeaderboardRefreshKey((v) => v + 1)}
      />

      <DailyBonus
        gameSlug={config.slug}
        onClaim={(reward) => {
          dispatch({ type: "add_money", amount: reward });
        }}
      />

      <Leaderboard gameSlug={config.slug} refreshKey={leaderboardRefreshKey} />

      <section className="bg-slate-900 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold">Next Goal</h2>
        <p className="text-slate-300">
          {nextMilestone.title} - ${formatMoney(nextMilestone.money)}
        </p>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upgrades</h2>
          <button
            type="button"
            onClick={resetGame}
            className="bg-red-900 hover:bg-red-800 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Reset
          </button>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: "upgrade_click" })}
          disabled={state.money < state.clickPower * 100}
          className="w-full bg-purple-600 disabled:bg-slate-700 rounded-xl p-4 text-left"
        >
          <div className="font-bold">Upgrade Click Power</div>
          <div className="text-sm text-slate-300">
            Cost: ${formatMoney(state.clickPower * 100)} | Current: +${state.clickPower}
          </div>
        </button>

        {state.upgrades.map((u) => {
          const cost = calcUpgradeCost(u);
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => dispatch({ type: "buy_upgrade", id: u.id })}
              disabled={state.money < cost}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 rounded-xl p-4 text-left"
            >
              <div className="flex justify-between">
                <span className="font-bold">{u.name}</span>
                <span>x{u.count}</span>
              </div>

              <div className="text-sm text-slate-400">
                Cost: ${formatMoney(cost)} | Revenue: +${formatMoney(u.income)}/sec
              </div>
            </button>
          );
        })}
      </section>

      <section className="bg-slate-900 rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-bold">Achievements</h2>
        {achievements.map((a) => (
          <div key={a.id} className={`rounded-xl p-3 ${a.unlocked ? "bg-green-900" : "bg-slate-800"}`}>
            {a.unlocked ? "✅" : "🔒"} {a.title}
          </div>
        ))}
      </section>

      <section className="bg-slate-900 rounded-2xl p-6">
        <h2 className="text-2xl font-bold">Tips</h2>
        <ul className="mt-3 space-y-2 text-slate-300">
          <li>Buy upgrades early for steady revenue.</li>
          <li>Click power helps you reach milestones faster.</li>
          <li>Offline earnings are capped at 1 hour for balance.</li>
        </ul>
      </section>
    </section>
  );
}
