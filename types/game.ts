export type Upgrade = {
  id: string;
  name: string;
  baseCost: number;
  income: number;
};

export type GameType =
  | "idle"
  | "snake"
  | "tetris"
  | "brick_breaker"
  | "mines"
  | "tile_match"
  | "bubble_shooter"
  | "coin_catcher"
  | "air_strike"
  | "box_puzzle"
  | "merge_fruit"
  | "number_merge"
  | "color_sort"
  | "word_connect"
  | "memory_flip"
  | "reaction_tap";

export type FAQItem = {
  q: string;
  a: string;
};

export type LuckConfig = {
  enabled: boolean;
  criticalChance: number;
  criticalMultiplier: number;
  luckyNames: string[];
};

export type GameConfig = {
  slug: string;
  gameType: GameType;
  gameName: string;
  description: string;
  shortDescription: string;
  category: string;
  emoji: string;
  currencyName: string;
  clickButtonText: string;
  faq?: FAQItem[];
  luck?: LuckConfig;
  milestones: {
    money: number;
    title: string;
  }[];
  upgrades: Upgrade[];
};
