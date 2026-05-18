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
      { label: "Business tycoon games", href: "/top/business-tycoon-games" },
      { label: "Free business games", href: "/top/free-business-games" },
      { label: "Best tycoon games", href: "/top/best-tycoon-games" },
    ],
  },
  {
    slug: "compare-games-guide",
    title: "How To Compare Browser Games - PromptInc",
    description:
      "A simple framework for choosing between similar games: what to look for, how to test quickly, and how to decide in minutes.",
    sections: [
      {
        heading: "Start with your goal",
        body: [
          "If you want long sessions, pick deeper management/tycoon games with multiple systems.",
          "If you want short sessions, pick idle/clicker games with fast upgrades and offline progress.",
        ],
      },
      {
        heading: "Use tags as a shortcut",
        body: [
          "Tags describe mechanics or themes. Shared tags usually mean similar gameplay loops.",
          "If two games share tags like Idle, Tycoon, or Startup, your decision can be based on pacing and UI preference.",
        ],
      },
      {
        heading: "Do a 3-minute test",
        body: [
          "Open both games and play each for 2–3 minutes.",
          "Choose the one where the next upgrade is clearer and the loop feels more satisfying.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Compare games", href: "/compare" },
      { label: "Top lists", href: "/top" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    slug: "incremental-games-beginner-guide",
    title: "Incremental Games Beginner Guide - PromptInc",
    description:
      "Learn how incremental games work: compounding upgrades, automation, and how to progress without grinding.",
    sections: [
      {
        heading: "Compounding is the game",
        body: [
          "Incremental games are about stacking multipliers and automation over time.",
          "The best upgrades usually increase your core loop output rather than adding minor bonuses.",
        ],
      },
      {
        heading: "Automation first",
        body: [
          "Automation reduces click/attention cost and increases long-term returns.",
          "If the game offers automation upgrades, prioritize them early.",
        ],
      },
      {
        heading: "When to reset",
        body: [
          "If a game has prestige, reset when the new permanent bonus meaningfully speeds up the next run.",
          "Avoid resetting too early; wait until the bonus changes your pace.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Best incremental games", href: "/top/best-incremental-games" },
      { label: "Free idle games", href: "/top/free-idle-games" },
      { label: "Offline income FAQ", href: "/faq/how-offline-income-works" },
    ],
  },
  {
    slug: "tycoon-bottleneck-guide",
    title: "Tycoon Bottleneck Guide - PromptInc",
    description:
      "A fast way to identify bottlenecks in tycoon games and pick the upgrades that unlock the next growth tier.",
    sections: [
      {
        heading: "Common bottlenecks",
        body: [
          "Most tycoon games bottleneck on one of: production speed, capacity, demand, or automation.",
          "If income stalls, the bottleneck likely moved to a new system after your last unlock.",
        ],
      },
      {
        heading: "Upgrade decision rule",
        body: [
          "Pick upgrades that pay back quickly and unlock new tiers.",
          "Avoid upgrades that feel good but do not change your bottleneck.",
        ],
      },
      {
        heading: "Scaling the mid game",
        body: [
          "After automation, multipliers usually dominate.",
          "When you unlock a new market/system, rebalance around the new bottleneck.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Best tycoon games", href: "/top/best-tycoon-games" },
      { label: "Business simulator games", href: "/top/best-business-simulator-games" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    slug: "choose-your-next-game",
    title: "How To Choose Your Next Game - PromptInc",
    description:
      "A practical checklist to pick your next browser game based on session length, difficulty, and progression style.",
    sections: [
      {
        heading: "Choose by session length",
        body: [
          "10 minutes: clicker, puzzle, or arcade games.",
          "30+ minutes: tycoon/management games.",
          "Daily returns: idle games with offline income.",
        ],
      },
      {
        heading: "Choose by progression style",
        body: [
          "If you like planning: management and simulator games.",
          "If you like fast rewards: idle and clicker games.",
          "If you like themes: browse tags and pick a theme you enjoy.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Games", href: "/games" },
      { label: "Top lists", href: "/top" },
      { label: "Compare games", href: "/compare" },
      { label: "Tags", href: "/tags" },
    ],
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((p) => p.slug === slug) ?? null;
}
