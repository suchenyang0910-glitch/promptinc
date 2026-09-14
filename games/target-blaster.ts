import type { GameConfig } from "@/types/game";

export const targetBlaster: GameConfig = {
  slug: "target-blaster",
  gameType: "target_blaster",
  gameName: "Target Blaster",
  description: "A fast target shooting game for the browser. Hit the moving energy target before it relocates and set a new score.",
  shortDescription: "Hit the glowing target before it moves to a new position.",
  category: "Arcade",
  tags: ["Arcade", "Reflex", "Aim", "Casual"],
  emoji: "🎯",
  currencyName: "Score",
  clickButtonText: "Start Blasting",
  faq: [
    { q: "How do I play Target Blaster?", a: "Tap or click the glowing target before it relocates." },
    { q: "How do I earn more points?", a: "Hit consecutive targets to build a streak bonus." },
    { q: "Can I play on a phone?", a: "Yes. The target and play area are designed for touch input." },
  ],
  seo: {
    title: "Target Blaster - Free Online Aim Game",
    description: "Play Target Blaster free in your browser. Hit moving energy targets, build a streak, and test your aim in a 30-second round.",
    keywords: "Target Blaster, free aim game, target shooting game, browser arcade game",
  },
  milestones: [{ money: 200, title: "Sharp Aim" }, { money: 500, title: "Target Ace" }, { money: 900, title: "Blaster Elite" }],
  upgrades: [],
};
