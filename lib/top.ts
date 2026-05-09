import type { GameConfig } from "@/types/game";

import { topContentV1 } from "@/content/top";

export type TopPage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  pick: (game: GameConfig) => boolean;
};

export type TopContentRulesV1 = {
  gameTypes?: string[];
  categories?: string[];
  tagsAny?: string[];
  textAny?: string[];
};

export type TopContentV1 = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  rules: TopContentRulesV1;
};

function normalizeArray(v?: string[]) {
  return (v ?? []).map((s) => s.trim()).filter(Boolean);
}

function buildPick(rules: TopContentRulesV1) {
  const gameTypes = new Set(normalizeArray(rules.gameTypes).map((s) => s.toLowerCase()));
  const categories = new Set(normalizeArray(rules.categories).map((s) => s.toLowerCase()));
  const tagsAny = new Set(normalizeArray(rules.tagsAny).map((s) => s.toLowerCase()));
  const textAny = normalizeArray(rules.textAny).map((s) => s.toLowerCase());

  return (g: GameConfig) => {
    let ok = false;

    if (gameTypes.size > 0 && gameTypes.has(g.gameType.toLowerCase())) ok = true;
    if (categories.size > 0 && categories.has(g.category.toLowerCase())) ok = true;

    const tags = (g.tags ?? []).map((t) => t.toLowerCase());
    if (tagsAny.size > 0 && tags.some((t) => tagsAny.has(t))) ok = true;

    if (textAny.length > 0) {
      const text = `${g.gameName} ${g.description} ${g.shortDescription}`.toLowerCase();
      if (textAny.some((q) => text.includes(q))) ok = true;
    }

    return ok;
  };
}

export const topPages: TopPage[] = topContentV1.map((c) => ({
  slug: c.slug,
  title: `${c.title} - PromptInc`,
  description: c.description,
  keywords: c.keywords,
  pick: buildPick(c.rules),
}));

export function getTopPage(slug: string) {
  return topPages.find((p) => p.slug === slug) ?? null;
}

export function getTopGames(page: TopPage, games: GameConfig[]) {
  const list = games.filter(page.pick);
  const scoreTag = (g: GameConfig) => {
    const base = new Set((g.tags ?? []).map((t) => t.toLowerCase()));
    let score = 0;
    for (const k of page.keywords) {
      const kw = k.toLowerCase();
      if (g.category.toLowerCase().includes(kw)) score += 5;
      if (g.gameName.toLowerCase().includes(kw)) score += 5;
      for (const t of base) if (kw.includes(t) || t.includes(kw)) score += 2;
    }
    if (g.gameType === "idle") score += 1;
    return score;
  };

  return list
    .map((g) => ({ g, s: scoreTag(g) }))
    .sort((a, b) => (b.s !== a.s ? b.s - a.s : a.g.gameName.localeCompare(b.g.gameName)))
    .map((x) => x.g);
}
