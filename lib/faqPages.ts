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
  {
    slug: "what-is-a-tycoon-game",
    title: "What Is a Tycoon Game? - PromptInc",
    description: "A quick explanation of tycoon games and what makes them addictive.",
    items: [
      {
        q: "What is a tycoon game?",
        a: "Tycoon games are management/simulator games where you build and optimize a business or system over time.",
      },
      {
        q: "What is the core loop?",
        a: "Earn money → upgrade capacity/speed → unlock new systems → repeat with higher multipliers.",
      },
      {
        q: "How do I progress faster?",
        a: "Identify the bottleneck and upgrade that first. Automation and multipliers usually have the best ROI.",
      },
    ],
    relatedLinks: [
      { label: "Best tycoon games", href: "/top/best-tycoon-games" },
      { label: "Business tycoon games", href: "/top/business-tycoon-games" },
      { label: "Tycoon guide", href: "/guides/business-tycoon-strategy-guide" },
    ],
  },
  {
    slug: "what-is-an-idle-game",
    title: "What Is an Idle Game? - PromptInc",
    description: "Idle games explained: automation, offline progress, and compounding upgrades.",
    items: [
      {
        q: "What is an idle game?",
        a: "Idle games are designed around automated progress and compounding upgrades. You can keep progressing even with short sessions.",
      },
      {
        q: "Do idle games work while I'm offline?",
        a: "Many do. Offline income simulates progress while you are away and rewards you when you return.",
      },
      {
        q: "What upgrades matter most?",
        a: "Automation and multipliers are usually the most impactful upgrades.",
      },
    ],
    relatedLinks: [
      { label: "Free idle games", href: "/top/free-idle-games" },
      { label: "Best idle games", href: "/top/best-idle-games" },
      { label: "Offline income", href: "/faq/how-offline-income-works" },
    ],
  },
  {
    slug: "what-is-a-simulator-game",
    title: "What Is a Simulator Game? - PromptInc",
    description: "What simulator games are and how they differ from arcade games.",
    items: [
      {
        q: "What is a simulator game?",
        a: "Simulator games focus on modeling a system or business. They often reward optimization, planning, and resource management.",
      },
      {
        q: "Are simulator games hard?",
        a: "Not necessarily. Many browser simulators are beginner-friendly and start with a simple loop before adding complexity.",
      },
      {
        q: "What's the fastest way to pick one?",
        a: "Open a Top list and try 2–3 games for a few minutes. Use Compare pages to decide.",
      },
    ],
    relatedLinks: [
      { label: "Free simulator games", href: "/top/free-simulator-games" },
      { label: "Best simulator games", href: "/top/best-simulator-games" },
      { label: "Compare games", href: "/compare" },
    ],
  },
  {
    slug: "what-is-a-clicker-game",
    title: "What Is a Clicker Game? - PromptInc",
    description: "Clicker games explained: why they are satisfying and how progression works.",
    items: [
      {
        q: "What is a clicker game?",
        a: "Clicker games are simple games where clicking/tapping generates resources used for upgrades and automation.",
      },
      {
        q: "Are clicker games the same as idle games?",
        a: "They overlap. Many clicker games become idle over time as you unlock automation.",
      },
      {
        q: "How do I progress faster?",
        a: "Prioritize upgrades that increase your income rate, then unlock automation as soon as possible.",
      },
    ],
    relatedLinks: [
      { label: "Best clicker games", href: "/top/best-clicker-games" },
      { label: "Free clicker games", href: "/top/free-clicker-games" },
      { label: "Idle guide", href: "/guides/idle-browser-games-guide" },
    ],
  },
  {
    slug: "how-to-use-compare-pages",
    title: "How To Use Compare Pages - PromptInc",
    description: "How to pick between similar games using tags, categories, and fast playtesting.",
    items: [
      {
        q: "What are Compare pages?",
        a: "Compare pages are side-by-side pages that help you choose what to play next using shared tags, categories, and quick links.",
      },
      {
        q: "How should I use them?",
        a: "Start from a Top list or a Tag page, then open a comparison between two similar games. Try both games for 2–3 minutes and decide.",
      },
      {
        q: "Can I find more comparisons?",
        a: "Yes. Browse the Compare index and use categories/tags to discover more pairings.",
      },
    ],
    relatedLinks: [
      { label: "Compare games", href: "/compare" },
      { label: "Compare guide", href: "/guides/compare-games-guide" },
      { label: "Top lists", href: "/top" },
    ],
  },
  {
    slug: "why-is-a-game-slow",
    title: "Why Is a Game Slow? - PromptInc",
    description: "Common reasons browser games feel slow and how to improve performance.",
    items: [
      {
        q: "Why does a browser game feel slow?",
        a: "The most common causes are low device performance, too many background tabs, heavy extensions, or poor network conditions.",
      },
      {
        q: "What can I try first?",
        a: "Close background tabs, disable heavy extensions, refresh the page, and try a different browser.",
      },
      {
        q: "Does mobile behave differently?",
        a: "Yes. Mobile devices may throttle performance. Try lower brightness, close apps, and avoid battery-saver mode.",
      },
    ],
    relatedLinks: [
      { label: "Games", href: "/games" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    slug: "how-to-report-a-bug",
    title: "How To Report a Bug - PromptInc",
    description: "A quick checklist that helps us reproduce and fix issues faster.",
    items: [
      {
        q: "What should I include in a bug report?",
        a: "Include the game name, the URL, what you expected, what happened, your browser/device, and steps to reproduce.",
      },
      {
        q: "Should I include screenshots?",
        a: "Yes. Screenshots or short recordings are helpful, especially for UI or rendering issues.",
      },
      {
        q: "Where can I contact you?",
        a: "Use the contact page to reach us.",
      },
    ],
    relatedLinks: [
      { label: "Contact", href: "/contact" },
      { label: "Games", href: "/games" },
    ],
  },
];

export function getFaqPage(slug: string) {
  return faqPages.find((p) => p.slug === slug) ?? null;
}
