import type { GameConfig } from "@/types/game";

export const reactionTap: GameConfig = {
  slug: "reaction-tap",
  gameType: "reaction_tap",
  gameName: "Reaction Tap",
  description:
    "Test your reflexes. Tap targets as fast as you can before they disappear and set a new high score.",
  shortDescription: "Tap the target quickly. Faster taps, higher score.",
  category: "Arcade",
  tags: ["Arcade", "Reflex", "Casual"],
  emoji: "⚡",
  currencyName: "Score",
  clickButtonText: "Start Game",
  faq: [
    { q: "How do I play?", a: "Tap the target circle as it appears. New targets spawn quickly." },
    { q: "How do I score?", a: "Each hit adds points. Keeping a streak gives a small bonus." },
    { q: "When does the game end?", a: "The round ends when the timer reaches 0." },
  ],
  milestones: [
    { money: 200, title: "Nice Reflex" },
    { money: 600, title: "Quick Hands" },
    { money: 1200, title: "Speedster" },
    { money: 2000, title: "Lightning Tap" },
  ],
  upgrades: [],
};
