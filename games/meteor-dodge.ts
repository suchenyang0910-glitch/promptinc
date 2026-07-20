import type { GameConfig } from "@/types/game";

export const meteorDodge: GameConfig = {
  slug: "meteor-dodge",
  gameType: "meteor_dodge",
  gameName: "Meteor Dodge",
  description:
    "Play Meteor Dodge online for free. Move left and right to dodge falling meteors and survive as long as you can.",
  shortDescription: "Slide to dodge meteors. Survive longer to score higher.",
  category: "Retro Arcade",
  tags: ["Retro", "Arcade", "Survival", "Reflex"],
  emoji: "☄️",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I move?", a: "Use Left/Right arrow keys on desktop or the on-screen buttons on mobile." },
    { q: "How do I score?", a: "Score increases as you survive. Difficulty ramps up over time." },
    { q: "Any tips?", a: "Small, controlled moves beat big swings. Stay near the center when possible." },
  ],
  seo: {
    title: "Meteor Dodge - Free Online Survival Arcade Game",
    description: "Play Meteor Dodge for free online. Dodge falling space rocks, survive as long as you can, and climb the global leaderboard in this high-intensity arcade game.",
    keywords: "Meteor Dodge, dodge game, survival arcade, free online game, browser game",
  },
  milestones: [
    { money: 50, title: "Warm Up" },
    { money: 200, title: "Close Calls" },
    { money: 500, title: "Survivor" },
    { money: 900, title: "Meteor Master" },
  ],
  upgrades: [],
};

