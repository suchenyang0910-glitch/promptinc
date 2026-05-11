import type { GameConfig } from "@/types/game";

export const bubbleShooter: GameConfig = {
  slug: "bubble-shooter",
  gameType: "bubble_shooter",
  gameName: "Bubble Pop",
  description:
    "Play a bubble shooter-style game online for free. Pop matching bubbles, build combos, and climb the leaderboard in this relaxing retro arcade game.",
  shortDescription: "Pop bubble groups, build combos, and score big.",
  category: "Retro Arcade",
  tags: ["Puzzle", "Bubble", "Arcade"],
  emoji: "🫧",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I play?", a: "Tap bubble groups to pop them. Bigger groups give more points." },
    { q: "Does it support mobile?", a: "Yes. The game is designed for touch controls." },
    { q: "When do I lose?", a: "If the board fills up, the game ends." },
  ],
  seo: {
    title: "Bubble Pop - Free Online Retro Arcade Game",
    description: "Play Bubble Pop online for free. Free browser-based game by PromptInc.",
    keywords: "play Bubble Pop online free, Bubble Pop game, Retro Arcade game, free online game, browser game, promptinc",
  },
  milestones: [
    { money: 100, title: "Pop Starter" },
    { money: 300, title: "Combo Builder" },
    { money: 800, title: "Bubble Pro" },
    { money: 1500, title: "Pop Legend" },
  ],
  upgrades: [],
};
