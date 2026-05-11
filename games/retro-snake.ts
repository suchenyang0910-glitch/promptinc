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
  seo: {
    title: "Retro Snake - Free Online Retro Arcade Game",
    description: "Play Retro Snake online for free. Free browser-based game by PromptInc.",
    keywords: "play Retro Snake online free, Retro Snake game, Retro Arcade game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 10, title: "Tiny Snake" },
    { money: 50, title: "Growing Snake" },
    { money: 100, title: "Retro Master" },
    { money: 500, title: "Snake Legend" },
  ],
  upgrades: [],
};
