import type { GameConfig } from "@/types/game";

export const retroAirStrike: GameConfig = {
  slug: "retro-air-strike",
  gameType: "air_strike",
  gameName: "Space Shooter X",
  description:
    "Fly, shoot, and survive in this retro arcade space shooter. Dodge enemies, rack up points, and climb the leaderboard.",
  shortDescription: "Quick top-down shooter with high-score runs.",
  category: "Retro Arcade",
  tags: ["Shooter", "Arcade", "Space"],
  emoji: "✈️",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I move?", a: "Use arrow keys on desktop or the on-screen pad on mobile." },
    { q: "How do I shoot?", a: "Shooting is automatic while playing. Focus on movement and dodging." },
    { q: "When does it end?", a: "A collision with an enemy ends the game." },
  ],
  seo: {
    title: "Space Shooter X - Free Online Retro Arcade Game",
    description: "Play Space Shooter X online for free. Free browser-based game by PromptInc.",
    keywords: "play Space Shooter X online free, Space Shooter X game, Retro Arcade game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 10, title: "First Down" },
    { money: 40, title: "Ace" },
    { money: 100, title: "Squad Leader" },
    { money: 200, title: "Sky Legend" },
  ],
  upgrades: [],
};
