import type { GameConfig } from "@/types/game";

export const mathSprint: GameConfig = {
  slug: "math-sprint",
  gameType: "math_sprint",
  gameName: "Math Sprint",
  description: "A fast mental-math browser game. Choose the correct answer to short arithmetic questions before the 30-second timer ends.",
  shortDescription: "Solve quick arithmetic questions and keep your answer streak alive.",
  category: "Puzzle",
  tags: ["Puzzle", "Math", "Brain", "Casual"],
  emoji: "➗",
  currencyName: "Score",
  clickButtonText: "Start Sprint",
  faq: [
    { q: "How do I play Math Sprint?", a: "Pick the correct answer for each arithmetic question as quickly as possible." },
    { q: "How do I score?", a: "Correct answers earn points. A streak earns a growing bonus." },
    { q: "Is Math Sprint free?", a: "Yes. You can play directly in your browser for free." },
  ],
  seo: {
    title: "Math Sprint - Free Online Mental Math Game",
    description: "Play Math Sprint free online. Solve quick arithmetic questions, build a streak, and challenge your brain in 30 seconds.",
    keywords: "Math Sprint, free math game, mental math online, browser puzzle game",
  },
  milestones: [{ money: 100, title: "Fast Thinker" }, { money: 300, title: "Number Ninja" }, { money: 600, title: "Math Master" }],
  upgrades: [],
};
