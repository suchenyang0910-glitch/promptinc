import type { GameConfig } from "@/types/game";

export const boxPuzzle: GameConfig = {
  slug: "box-puzzle",
  gameType: "box_puzzle",
  gameName: "Box Puzzle",
  description: "Solve classic box puzzles online. Push boxes onto targets with simple controls.",
  shortDescription: "Sokoban-style box pushing puzzle with quick levels.",
  category: "Retro Arcade",
  emoji: "📦",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "What is the goal?", a: "Push all boxes onto target tiles to clear the level." },
    { q: "How do I control on mobile?", a: "Use the on-screen direction buttons." },
    { q: "How do I score points?", a: "You score more by solving in fewer moves." },
  ],
  milestones: [
    { money: 200, title: "First Clear" },
    { money: 600, title: "Puzzle Brain" },
    { money: 1200, title: "Box Master" },
    { money: 2000, title: "Sokoban Legend" },
  ],
  upgrades: [],
};

