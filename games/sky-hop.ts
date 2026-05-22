import type { GameConfig } from "@/types/game";

export const skyHop: GameConfig = {
  slug: "sky-hop",
  gameType: "sky_hop",
  gameName: "Sky Hop",
  description:
    "Play Sky Hop online for free. Tap to hop and fly through pipes in this fast, one-button arcade challenge.",
  shortDescription: "One-button hopping. Thread the gaps and chase a new high score.",
  category: "Retro Arcade",
  tags: ["Retro", "Arcade", "Endless", "One Button"],
  emoji: "🕊️",
  currencyName: "Score",
  clickButtonText: "Start",
  faq: [
    { q: "How do I play?", a: "Tap (or press Space) to hop. Pass pipes to score points." },
    { q: "What ends the run?", a: "Hitting a pipe or the ground ends the run." },
    { q: "Is there a strategy?", a: "Keep steady rhythm and aim for the middle of each gap." },
  ],
  seo: {
    title: "Sky Hop - Free Online One-Button Arcade Game",
    description: "Play Sky Hop online for free. Tap to hop and dodge pipes in your browser.",
    keywords: "Sky Hop, one button game, free online arcade game, browser game, tap to play",
  },
  milestones: [
    { money: 1, title: "First Gap" },
    { money: 5, title: "Steady Wings" },
    { money: 15, title: "Pipe Runner" },
    { money: 30, title: "Sky Legend" },
  ],
  upgrades: [],
};

