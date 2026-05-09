import type { GameConfig } from "@/types/game";

export const brickBreaker: GameConfig = {
  slug: "brick-breaker",
  gameType: "brick_breaker",
  gameName: "Brick Smash",
  description:
    "Play a classic brick breaker online for free. Bounce the ball, smash bricks, and set a new high score in this retro arcade game.",
  shortDescription: "Smash bricks with a paddle, rack up combos, and score big.",
  category: "Retro Arcade",
  tags: ["Retro", "Arcade", "Brick Breaker"],
  emoji: "🏓",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I control the paddle?", a: "On desktop, move with mouse. On mobile, drag left/right or use buttons." },
    { q: "When does the game end?", a: "The game ends when you lose all lives or the ball drops below the paddle." },
    { q: "How do I score points?", a: "Each brick you break adds points. Clear more to climb the leaderboard." },
  ],
  milestones: [
    { money: 10, title: "First Hit" },
    { money: 50, title: "Brick Cracker" },
    { money: 150, title: "Combo Player" },
    { money: 300, title: "Arcade Champion" },
  ],
  upgrades: [],
};
