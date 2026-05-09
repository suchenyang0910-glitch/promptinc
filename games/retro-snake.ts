import type { GameConfig } from "@/types/game";

export const retroSnake: GameConfig = {
  slug: "retro-snake",
  gameType: "snake",
  gameName: "Retro Snake",
  description: "Play the classic retro snake game online for free directly in your browser.",
  shortDescription: "Classic snake game playable online.",
  category: "Retro Arcade",
  tags: ["Retro", "Arcade", "Snake"],
  emoji: "🐍",
  currencyName: "Score",
  clickButtonText: "Start Game",
  milestones: [
    { money: 10, title: "Tiny Snake" },
    { money: 50, title: "Growing Snake" },
    { money: 100, title: "Retro Master" },
    { money: 500, title: "Snake Legend" },
  ],
  upgrades: [],
};
