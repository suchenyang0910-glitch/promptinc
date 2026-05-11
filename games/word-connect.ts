import type { GameConfig } from "@/types/game";

export const wordConnect: GameConfig = {
  slug: "word-connect",
  gameType: "word_connect",
  gameName: "Word Connect",
  description:
    "Connect adjacent letters to form hidden words. Swipe across the grid to find all targets before the timer ends.",
  shortDescription: "Swipe letters to form words and clear the list.",
  category: "Word",
  tags: ["Word", "Puzzle", "Spelling"],
  emoji: "🔤",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I make a word?", a: "Press and drag across adjacent letters (including diagonals), without reusing a tile." },
    { q: "How do I score?", a: "Each new target word gives points. Finish early for a time bonus." },
    { q: "When does the game end?", a: "You win by finding all target words, or lose when the timer hits 0." },
  ],
  seo: {
    title: "Word Connect - Free Online Word Game",
    description: "Play Word Connect online for free. Free browser-based game by PromptInc.",
    keywords: "play Word Connect online free, Word Connect game, Word game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 200, title: "First Word" },
    { money: 700, title: "Warm Up" },
    { money: 1500, title: "Word Hunter" },
    { money: 2500, title: "Dictionary Mode" },
  ],
  upgrades: [],
};
