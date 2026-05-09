import type { GameConfig } from "@/types/game";

export const classicMines: GameConfig = {
  slug: "classic-mines",
  gameType: "mines",
  gameName: "Classic Mines",
  description: "Play classic mines online. Reveal safe tiles, avoid mines, and clear the board for a high score.",
  shortDescription: "Retro mines puzzle with tap-to-reveal controls.",
  category: "Retro Arcade",
  emoji: "💣",
  currencyName: "Score",
  clickButtonText: "New Game",
  faq: [
    { q: "How do I play?", a: "Reveal tiles to find safe spaces. Numbers tell you nearby mines." },
    { q: "How do I flag mines on mobile?", a: "Toggle Flag Mode, then tap tiles to place/remove flags." },
    { q: "How is score calculated?", a: "Score increases as you reveal safe tiles. Hitting a mine ends the run." },
  ],
  milestones: [
    { money: 10, title: "Careful Start" },
    { money: 30, title: "Puzzle Solver" },
    { money: 60, title: "Mine Reader" },
    { money: 100, title: "Clear Board" },
  ],
  upgrades: [],
};

