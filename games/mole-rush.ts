import type { GameConfig } from "@/types/game";

export const moleRush: GameConfig = {
  slug: "mole-rush",
  gameType: "mole_rush",
  gameName: "Mole Rush",
  description: "A quick browser whack-a-mole game. Find the popping mole, tap it, and build a high score before the timer runs out.",
  shortDescription: "Tap the mole in the nine-hole grid before it ducks away.",
  category: "Arcade",
  tags: ["Arcade", "Reflex", "Casual"],
  emoji: "🔨",
  currencyName: "Score",
  clickButtonText: "Start Round",
  faq: [
    { q: "How do I play Mole Rush?", a: "Tap the mole as it appears in the grid. Every hit earns points." },
    { q: "Does the game work on mobile?", a: "Yes. Each hole is a large touch-friendly button." },
    { q: "How long is a round?", a: "Each round lasts 30 seconds." },
  ],
  seo: {
    title: "Mole Rush - Free Online Whack-a-Mole Game",
    description: "Play Mole Rush free in your browser. Tap the popping mole, beat the 30-second clock, and submit your high score.",
    keywords: "Mole Rush, whack a mole online, free arcade game, browser reflex game",
  },
  milestones: [{ money: 150, title: "Quick Hammer" }, { money: 350, title: "Mole Master" }, { money: 700, title: "Grid Legend" }],
  upgrades: [],
};
