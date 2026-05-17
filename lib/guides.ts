export type GuideSection = {
  heading: string;
  body: string[];
};

export type GuidePage = {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
  relatedLinks?: Array<{ label: string; href: string }>;
};

export const guidePages: GuidePage[] = [
  {
    slug: "ai-startup-beginner-guide",
    title: "AI Startup Games Beginner Guide - PromptInc",
    description:
      "Learn how AI startup simulator games work, what to prioritize early, and how to scale faster in browser-based business games.",
    sections: [
      {
        heading: "What AI startup games are",
        body: [
          "AI startup games are business simulator or tycoon games where you build products, hire a team, ship features, and grow revenue.",
          "They are usually designed around fast iteration loops: earn money → upgrade → unlock systems → optimize growth.",
        ],
      },
      {
        heading: "Fast early-game progress",
        body: [
          "Pick upgrades that increase your core loop output (income, production speed, conversion, or capacity).",
          "Avoid spreading across too many systems early; focus on a single growth lever until it compounding becomes obvious.",
          "If the game has automation, prioritize it as soon as you can afford it.",
        ],
      },
      {
        heading: "Scaling strategy",
        body: [
          "Treat every upgrade as ROI: prefer upgrades that pay back quickly and unlock new tiers.",
          "When progress slows, it usually means the bottleneck moved: check whether you need capacity, speed, or demand.",
          "Use milestones (new feature tiers, new offices, new markets) as your reset points to re-balance upgrades.",
        ],
      },
      {
        heading: "Mobile tips",
        body: [
          "On mobile, use games with larger UI and clear buttons.",
          "If you play in short sessions, choose idle games with offline income or auto-collection mechanics.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Browse all games", href: "/games" },
      { label: "Top lists", href: "/top" },
      { label: "Game categories", href: "/categories" },
      { label: "Tags", href: "/tags" },
    ],
  },
  {
    slug: "idle-browser-games-guide",
    title: "Idle Browser Games Guide - PromptInc",
    description:
      "A practical guide to idle and clicker browser games: how progression works, what upgrades matter, and how to play efficiently.",
    sections: [
      {
        heading: "Core loop",
        body: [
          "Idle games reward consistent upgrades and gradual compounding.",
          "Your goal is to increase income per minute, reduce downtime, and unlock automation.",
        ],
      },
      {
        heading: "Best upgrade priorities",
        body: [
          "Automation > multipliers > capacity > cosmetics.",
          "If a game has prestige or resets, invest into permanent multipliers before temporary boosts.",
        ],
      },
      {
        heading: "Returning daily",
        body: [
          "Daily rewards and offline income mechanics are designed to maximize compounding.",
          "Short visits are fine: claim rewards, reinvest into your best ROI upgrade, then leave it running.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Best idle games", href: "/top/best-idle-games" },
      { label: "Idle category", href: "/categories/idle" },
      { label: "Browse idle tags", href: "/tags/idle" },
    ],
  },
  {
    slug: "business-tycoon-strategy-guide",
    title: "Business Tycoon Strategy Guide - PromptInc",
    description:
      "How to think in tycoon and business simulator games: bottlenecks, ROI upgrades, and when to expand into new systems.",
    sections: [
      {
        heading: "Find the bottleneck",
        body: [
          "When progress slows, identify the limiting factor: production, demand, storage, or speed.",
          "Upgrade the bottleneck first; everything else is secondary.",
        ],
      },
      {
        heading: "ROI-first upgrades",
        body: [
          "Prefer upgrades that pay back quickly, especially early and mid game.",
          "One strong multiplier is often better than multiple small upgrades.",
        ],
      },
      {
        heading: "When to expand",
        body: [
          "Expand when your current system is stable and the next tier unlock meaningfully increases long-term income.",
          "If expansion adds complexity but not income, delay it until later.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Best business games", href: "/top/best-business-games" },
      { label: "Business tag", href: "/tags/business" },
      { label: "Tycoon category", href: "/categories/tycoon" },
    ],
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((p) => p.slug === slug) ?? null;
}

