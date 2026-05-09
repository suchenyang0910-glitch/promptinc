import type { GameConfig } from "@/types/game";

export const tileMatch: GameConfig = {
  slug: "tile-match",
  gameType: "tile_match",
  gameName: "Tile Match",
  description: "Play tile match online. Flip tiles, find pairs, and clear the board as fast as you can.",
  shortDescription: "Memory-style tile matching with quick rounds.",
  category: "Retro Arcade",
  tags: ["Puzzle", "Memory", "Match"],
  emoji: "🧩",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "What is the goal?", a: "Find matching pairs to clear all tiles. Fewer mistakes scores higher." },
    { q: "Is it mobile-friendly?", a: "Yes. Tap tiles to flip them and match pairs." },
    { q: "How do I get a higher score?", a: "Match quickly and avoid mismatches to maximize your score." },
  ],
  milestones: [
    { money: 50, title: "First Pairs" },
    { money: 150, title: "Good Memory" },
    { money: 300, title: "Match Master" },
    { money: 500, title: "Perfect Run" },
  ],
  upgrades: [],
};
