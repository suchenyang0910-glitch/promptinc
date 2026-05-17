import type { GameConfig } from "@/types/game";

export type ComparePair = {
  a: string;
  b: string;
};

export function buildComparePair(a: string, b: string) {
  const [x, y] = [a, b].sort();
  return `${x}-vs-${y}`;
}

export function parseComparePair(pair: string): ComparePair | null {
  const parts = pair.split("-vs-");
  if (parts.length !== 2) return null;
  const a = parts[0]?.trim();
  const b = parts[1]?.trim();
  if (!a || !b || a === b) return null;
  return { a, b };
}

export function compareScore(a: GameConfig, b: GameConfig) {
  let score = 0;
  if (a.category === b.category) score += 100;
  if (a.gameType === b.gameType) score += 15;

  const tagsA = new Set((a.tags ?? []).map((t) => t.toLowerCase()));
  for (const t of b.tags ?? []) {
    if (tagsA.has(t.toLowerCase())) score += 10;
  }

  return score;
}

export function getCompareCandidates(allGames: GameConfig[], perGame = 2, maxPairs = 200) {
  const pairs = new Map<string, { pair: ComparePair; score: number }>();
  const list = allGames.slice();
  const bySlug = new Map(list.map((g) => [g.slug, g] as const));

  for (const g of list) {
    const scored = list
      .filter((x) => x.slug !== g.slug)
      .map((x) => ({ x, s: compareScore(g, x) }))
      .sort((a, b) => (b.s !== a.s ? b.s - a.s : a.x.gameName.localeCompare(b.x.gameName)))
      .slice(0, perGame);

    for (const c of scored) {
      const key = buildComparePair(g.slug, c.x.slug);
      const prev = pairs.get(key);
      if (!prev || c.s > prev.score) {
        const parsed = parseComparePair(key);
        if (parsed && bySlug.has(parsed.a) && bySlug.has(parsed.b)) {
          pairs.set(key, { pair: parsed, score: c.s });
        }
      }
    }
  }

  return Array.from(pairs.entries())
    .sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0]))
    .slice(0, maxPairs)
    .map(([key]) => key);
}

