import type { GameConfig, GameType } from "@/types/game";

export type GameContentV1 = Omit<GameConfig, "milestones" | "upgrades" | "gameType"> & {
  gameType: GameType;
  milestones: { money: number; title: string }[];
  upgrades: { id: string; name: string; baseCost: number; income: number }[];
};

export function gameFromContentV1(content: GameContentV1): GameConfig {
  return {
    ...content,
    milestones: content.milestones.map((m) => ({ money: Number(m.money), title: String(m.title) })),
    upgrades: content.upgrades.map((u) => ({
      id: String(u.id),
      name: String(u.name),
      baseCost: Number(u.baseCost),
      income: Number(u.income),
    })),
  };
}
