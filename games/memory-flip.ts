import type { GameConfig } from "@/types/game";

export const memoryFlip: GameConfig = {
  slug: "memory-flip",
  gameType: "memory_flip",
  gameName: "Memory Flip",
  description:
    "Flip cards to find matching pairs. Remember positions, beat the clock, and climb the leaderboard.",
  shortDescription: "Flip cards, match pairs, and finish fast.",
  category: "Memory",
  emoji: "🧠",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I play?", a: "Tap two cards to reveal them. If they match, they stay open." },
    { q: "How do I score?", a: "Matching pairs gives points. Completing the board adds a time bonus." },
    { q: "When does the game end?", a: "You win when all pairs are matched, or lose when time runs out." },
  ],
  milestones: [
    { money: 300, title: "First Pair" },
    { money: 900, title: "Good Memory" },
    { money: 1700, title: "Quick Match" },
    { money: 2600, title: "Perfect Recall" },
  ],
  upgrades: [],
};

