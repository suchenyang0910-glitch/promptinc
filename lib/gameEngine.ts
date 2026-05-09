import type { GameConfig, Upgrade as GameUpgrade } from "@/types/game";

export type Upgrade = GameUpgrade & { count: number };

export type SaveData = {
  money?: number;
  clickPower?: number;
  upgrades?: Array<Pick<Upgrade, "id" | "count">>;
  lastSaveTime?: number;
};

export type GameState = {
  money: number;
  clickPower: number;
  upgrades: Upgrade[];
  offlineEarnings: number;
};

export type Action =
  | { type: "hydrate"; payload: GameState }
  | { type: "tick"; multiplier?: number }
  | { type: "add_money"; amount: number }
  | { type: "buy_upgrade"; id: string }
  | { type: "upgrade_click" }
  | { type: "reset" };

export function getSaveKey(config: GameConfig) {
  return `${config.slug}_save_v1`;
}

export function makeDefaultUpgrades(config: GameConfig): Upgrade[] {
  return config.upgrades.map((u) => ({ ...u, count: 0 }));
}

export function calcIncomePerSecond(upgrades: Upgrade[]): number {
  return upgrades.reduce((sum, u) => sum + u.income * u.count, 0);
}

export function calcUpgradeCost(u: Upgrade): number {
  return Math.floor(u.baseCost * Math.pow(1.18, u.count));
}

export function formatMoney(n: number): string {
  const safe = Number.isFinite(n) ? Math.max(0, n) : 0;
  return Math.floor(safe).toLocaleString();
}

export function gameReducer(config: GameConfig) {
  return function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
      case "hydrate":
        return action.payload;
      case "tick": {
        const income = calcIncomePerSecond(state.upgrades);
        if (income <= 0) return state;
        const mul = typeof action.multiplier === "number" ? action.multiplier : 1;
        return { ...state, money: state.money + income * mul };
      }
      case "add_money": {
        if (!Number.isFinite(action.amount) || action.amount <= 0) return state;
        return { ...state, money: state.money + action.amount };
      }
      case "buy_upgrade": {
        const idx = state.upgrades.findIndex((u) => u.id === action.id);
        if (idx < 0) return state;
        const target = state.upgrades[idx];
        const cost = calcUpgradeCost(target);
        if (state.money < cost) return state;

        const nextUpgrades = state.upgrades.slice();
        nextUpgrades[idx] = { ...target, count: target.count + 1 };
        return {
          ...state,
          money: state.money - cost,
          upgrades: nextUpgrades,
        };
      }
      case "upgrade_click": {
        const cost = state.clickPower * 100;
        if (state.money < cost) return state;
        return {
          ...state,
          money: state.money - cost,
          clickPower: state.clickPower + 1,
        };
      }
      case "reset":
        return {
          money: 0,
          clickPower: 1,
          upgrades: makeDefaultUpgrades(config),
          offlineEarnings: 0,
        };
      default:
        return state;
    }
  };
}

export function tryParseSave(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function buildHydratedState(config: GameConfig, saved: SaveData | null): GameState {
  const defaults: GameState = {
    money: 0,
    clickPower: 1,
    upgrades: makeDefaultUpgrades(config),
    offlineEarnings: 0,
  };

  if (!saved) return defaults;

  const safeMoney = typeof saved.money === "number" ? saved.money : 0;
  const safeClickPower = typeof saved.clickPower === "number" ? saved.clickPower : 1;
  const safeLastSaveTime = typeof saved.lastSaveTime === "number" ? saved.lastSaveTime : 0;

  const nextUpgrades = makeDefaultUpgrades(config).map((u) => {
    const hit = saved.upgrades?.find((x) => x.id === u.id);
    const count = typeof hit?.count === "number" ? Math.max(0, Math.floor(hit.count)) : 0;
    return { ...u, count };
  });

  const income = calcIncomePerSecond(nextUpgrades);
  const now = Date.now();
  const offlineSeconds = Math.max(0, Math.floor((now - safeLastSaveTime) / 1000));
  const cappedSeconds = Math.min(offlineSeconds, 3600);
  const offlineEarnings = cappedSeconds * income;

  return {
    money: safeMoney + offlineEarnings,
    clickPower: Math.max(1, Math.floor(safeClickPower)),
    upgrades: nextUpgrades,
    offlineEarnings,
  };
}
