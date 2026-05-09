import type { GameConfig } from "@/types/game";

export const numberMerge: GameConfig = {
  slug: "number-merge",
  gameType: "number_merge",
  gameName: "Number Merge",
  description:
    "Merge numbers on a 4x4 board to build bigger tiles. Swipe or use arrow controls to combine values and chase a new high score.",
  shortDescription: "Swipe to merge tiles and build the biggest number.",
  category: "Puzzle",
  tags: ["Puzzle", "Merge", "Numbers"],
  emoji: "🔢",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I move tiles?", a: "On mobile, swipe in any direction. On desktop, use arrow keys or the on-screen controls." },
    { q: "How do I score points?", a: "You gain points equal to the value created by each merge." },
    { q: "When does the game end?", a: "Game Over happens when no moves are possible." },
  ],
  milestones: [
    { money: 200, title: "First Merge" },
    { money: 1000, title: "On a Roll" },
    { money: 5000, title: "Big Numbers" },
    { money: 15000, title: "Merge Master" },
  ],
  upgrades: [],
};
