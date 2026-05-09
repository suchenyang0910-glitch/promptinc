import type { GameConfig } from "@/types/game";

export const colorSort: GameConfig = {
  slug: "color-sort",
  gameType: "color_sort",
  gameName: "Color Sort",
  description:
    "Sort colors into tubes so each tube contains a single color. Tap to pour and solve the puzzle before time runs out.",
  shortDescription: "Tap tubes to pour colors and complete the sort.",
  category: "Puzzle",
  tags: ["Puzzle", "Sort", "Logic"],
  emoji: "🧪",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I pour colors?", a: "Tap a tube to pick it up, then tap another tube to pour into it." },
    { q: "What are valid moves?", a: "You can pour onto an empty tube or onto the same top color, if there is space." },
    { q: "When does the game end?", a: "You win when all colors are sorted. Game Over happens when time runs out." },
  ],
  milestones: [
    { money: 500, title: "First Sort" },
    { money: 1500, title: "Clean Setup" },
    { money: 3000, title: "Tube Tactician" },
    { money: 6000, title: "Perfect Sort" },
  ],
  upgrades: [],
};
