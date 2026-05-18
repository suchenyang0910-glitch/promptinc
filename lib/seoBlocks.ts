import type { GameConfig } from "@/types/game";

export type FaqItem = {
  q: string;
  a: string;
};

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function inferGuideLinks(topic: string) {
  const t = topic.toLowerCase();
  const links: Array<{ label: string; href: string }> = [];

  if (t.includes("ai") || t.includes("startup") || t.includes("agent") || t.includes("prompt")) {
    links.push({ label: "AI Startup Beginner Guide", href: "/guides/ai-startup-beginner-guide" });
  }

  if (t.includes("idle") || t.includes("clicker") || t.includes("offline")) {
    links.push({ label: "Idle Browser Games Guide", href: "/guides/idle-browser-games-guide" });
    links.push({ label: "How Offline Income Works", href: "/faq/how-offline-income-works" });
  }

  if (t.includes("business") || t.includes("tycoon") || t.includes("simulator") || t.includes("manager")) {
    links.push({ label: "Business Tycoon Strategy Guide", href: "/guides/business-tycoon-strategy-guide" });
  }

  if (links.length === 0) {
    links.push({ label: "Guides", href: "/guides" });
    links.push({ label: "FAQ", href: "/faq" });
  }

  return links.slice(0, 4);
}

export function topTags(games: GameConfig[], limit = 8) {
  const counts = new Map<string, number>();
  for (const g of games) {
    for (const t of g.tags ?? []) {
      const key = t.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([t]) => t);
}

export function tldrForTopic(topic: string) {
  const t = topic.toLowerCase();
  const bullets: string[] = [];

  bullets.push("All games here are playable instantly in your browser.");

  if (t.includes("idle") || t.includes("clicker")) {
    bullets.push("Idle games reward automation and compounding upgrades.");
    bullets.push("If available, offline income is the best mechanic for daily returns.");
  }

  if (t.includes("ai") || t.includes("startup")) {
    bullets.push("AI/startup games focus on fast iteration: earn → upgrade → unlock systems.");
    bullets.push("Prioritize upgrades that increase your core loop output early.");
  }

  if (t.includes("business") || t.includes("tycoon") || t.includes("simulator")) {
    bullets.push("In tycoon games, identify the bottleneck and upgrade that first.");
  }

  bullets.push("Use Compare pages to choose what to play next in one click.");

  return Array.from(new Set(bullets)).slice(0, 6);
}

