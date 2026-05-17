export type FaqItem = {
  q: string;
  a: string;
};

export type FaqPage = {
  slug: string;
  title: string;
  description: string;
  items: FaqItem[];
  relatedLinks?: Array<{ label: string; href: string }>;
};

export const faqPages: FaqPage[] = [
  {
    slug: "how-offline-income-works",
    title: "How Offline Income Works - PromptInc",
    description: "Understand offline income in idle games: timers, caps, and how to maximize your returns.",
    items: [
      {
        q: "What is offline income?",
        a: "Offline income is progress you earn while you are away. Many idle games simulate production during offline time and grant the rewards when you return.",
      },
      {
        q: "Why does offline income have a cap?",
        a: "Caps prevent infinite accumulation and keep upgrades meaningful. Typical caps range from a few hours to a day, and can often be increased by upgrades.",
      },
      {
        q: "How can I maximize offline income?",
        a: "Invest into automation and multipliers, then increase the offline cap if available. Before leaving, spend your currency on the best ROI upgrades.",
      },
    ],
    relatedLinks: [
      { label: "Best idle games", href: "/top/best-idle-games" },
      { label: "Idle category", href: "/categories/idle" },
      { label: "Idle tag", href: "/tags/idle" },
    ],
  },
  {
    slug: "is-it-free",
    title: "Is PromptInc Free? - PromptInc",
    description: "A quick FAQ about pricing, accounts, and what you can do without signing up.",
    items: [
      {
        q: "Do I need to pay to play?",
        a: "No. Games on PromptInc are free to play in your browser.",
      },
      {
        q: "Do I need an account?",
        a: "You can play without an account. Some features like saving progress or leaderboards may require sign-in.",
      },
      {
        q: "Why are there ads?",
        a: "Ads help cover hosting and development costs so the games can stay free.",
      },
    ],
    relatedLinks: [
      { label: "Browse games", href: "/games" },
      { label: "Top lists", href: "/top" },
    ],
  },
  {
    slug: "how-to-save-progress",
    title: "How To Save Progress - PromptInc",
    description: "How saving works across games, devices, and browsers.",
    items: [
      {
        q: "Is my progress saved automatically?",
        a: "Some games save locally in your browser. If a game supports cloud saving, you may need to sign in to sync between devices.",
      },
      {
        q: "Why did I lose my progress?",
        a: "Clearing browser storage, using private mode, or switching browsers can reset local saves. For long-term progress, use games with cloud save support when available.",
      },
      {
        q: "Can I transfer saves between devices?",
        a: "Only if the game supports account-based syncing. Otherwise, local saves are limited to the current browser and device.",
      },
    ],
    relatedLinks: [
      { label: "Play a game", href: "/games" },
      { label: "Leaderboards", href: "/leaderboards" },
    ],
  },
];

export function getFaqPage(slug: string) {
  return faqPages.find((p) => p.slug === slug) ?? null;
}

