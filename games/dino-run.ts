import type { GameConfig } from "@/types/game";

export const dinoRun: GameConfig = {
  slug: "dino-run",
  gameType: "dino_run",
  gameName: "Dino Run",
  description:
    "A classic Chrome dino-style endless runner. Tap or press Space to jump over cacti and birds, survive as long as you can, and climb the leaderboard.",
  shortDescription: "Jump over obstacles in this endless runner.",
  category: "Arcade",
  tags: ["Arcade", "Endless Runner", "Casual", "Retro"],
  emoji: "🦖",
  currencyName: "Score",
  clickButtonText: "Start Run",
  faq: [
    {
      q: "How do I play Dino Run?",
      a: "Tap the canvas or press Space / Up Arrow to jump. Avoid cacti and birds. The longer you survive, the higher your score.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. Tap the game area to jump. Large touch areas are used for mobile.",
    },
    {
      q: "How does difficulty change?",
      a: "The game speed increases every 250 points, making obstacles spawn faster and move more quickly.",
    },
  ],
  seo: {
    title: "Dino Run - Free Online Endless Runner Game",
    description:
      "Play Dino Run free in your browser. Jump over cacti and birds in this classic endless runner arcade game — mobile friendly, with leaderboards and no download.",
    keywords:
      "dino run, chrome dino, endless runner online, free arcade game, browser runner game, dinosaur jump game",
  },
  milestones: [
    { money: 250, title: "First Jump" },
    { money: 750, title: "Runner" },
    { money: 1500, title: "Desert Master" },
    { money: 3000, title: "Dino Legend" },
  ],
  upgrades: [],
};
