import type { GameConfig } from "@/types/game";

export const coinCatcher: GameConfig = {
  slug: "coin-catcher",
  gameType: "coin_catcher",
  gameName: "Coin Catcher",
  description: "Catch falling coins, dodge traps, and rack up points in this classic arcade-style game.",
  shortDescription: "Catch coins fast. Miss too many and it’s game over.",
  category: "Retro Arcade",
  emoji: "🪙",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I control the catcher?", a: "Use left/right keys on desktop or tap the mobile buttons." },
    { q: "What ends the game?", a: "Missing too many coins ends the game." },
    { q: "How do I score?", a: "Each caught coin adds points. Try to build streaks." },
  ],
  milestones: [
    { money: 10, title: "First Coin" },
    { money: 50, title: "Collector" },
    { money: 120, title: "Streak Runner" },
    { money: 250, title: "Coin Legend" },
  ],
  upgrades: [],
};

