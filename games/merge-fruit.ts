import type { GameConfig } from "@/types/game";

export const mergeFruit: GameConfig = {
  slug: "merge-fruit",
  gameType: "merge_fruit",
  gameName: "Merge Fruit",
  description: "Play a merge-style fruit puzzle online. Swipe to combine fruits and reach the biggest one.",
  shortDescription: "2048-style fruit merges with satisfying combos.",
  category: "Retro Arcade",
  tags: ["Puzzle", "Merge", "Casual"],
  emoji: "🍉",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I play?", a: "Swipe in a direction to slide tiles. Matching fruits merge into a bigger one." },
    { q: "Is it mobile-friendly?", a: "Yes. Use swipe gestures or on-screen controls." },
    { q: "When does the game end?", a: "The game ends when the board is full and no moves remain." },
  ],
  seo: {
    title: "Merge Fruit - Free Online Retro Arcade Game",
    description: "Play Merge Fruit online for free. Free browser-based game by PromptInc.",
    keywords: "play Merge Fruit online free, Merge Fruit game, Retro Arcade game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 200, title: "First Merge" },
    { money: 800, title: "Combo" },
    { money: 2000, title: "Big Fruit" },
    { money: 5000, title: "Merge Legend" },
  ],
  upgrades: [],
};
