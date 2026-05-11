import type { GameConfig } from "@/types/game";

export const brickBlockClassic: GameConfig = {
  slug: "brick-block-classic",
  gameType: "tetris",
  gameName: "Block Stack",
  description:
    "Play a classic block-stacking puzzle online. Stack falling blocks, clear lines, and chase a high score in this retro arcade game.",
  shortDescription: "Stack blocks, clear lines, and beat your high score.",
  category: "Retro Arcade",
  tags: ["Retro", "Arcade", "Block Puzzle"],
  emoji: "🧱",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I play?", a: "Move blocks left/right, rotate, and clear full lines to score points." },
    { q: "Does it work on mobile?", a: "Yes. Use the on-screen buttons to move, rotate, and drop blocks." },
    { q: "How is score calculated?", a: "You gain points by placing blocks and clearing lines. More lines = more points." },
  ],
  seo: {
    title: "Block Stack - Free Online Retro Arcade Game",
    description: "Play Block Stack online for free. Free browser-based game by PromptInc.",
    keywords: "play Block Stack online free, Block Stack game, Retro Arcade game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 200, title: "Warm Up" },
    { money: 800, title: "Line Cleaner" },
    { money: 2000, title: "Arcade Pro" },
    { money: 5000, title: "Block Legend" },
  ],
  upgrades: [],
};
