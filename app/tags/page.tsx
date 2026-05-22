import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { getCompareCandidates, parseComparePair } from "@/lib/compare";
import { tagToSlug } from "@/lib/tags";
import { topPages } from "@/lib/top";

export const metadata: Metadata = {
  title: "Tags - PromptInc",
  description: "Browse games by tags like idle, tycoon, puzzle, retro, and more.",
  alternates: {
    canonical: "/tags",
  },
};

export default function TagsPage() {
  const allGames = Object.values(games);
  const allTags = allGames
    .flatMap((g) => g.tags ?? [])
    .map((t) => t.trim())
    .filter(Boolean);

  const tags = Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));
  const pairs = getCompareCandidates(allGames, 2, 12);
  const featuredTop = topPages.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Tags</h1>
          <p className="text-slate-400 text-lg">Explore games by topic and style.</p>
        </div>

        <AdSlot variant="banner" slot="tags-top" />

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tagToSlug(tag)}`}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 font-semibold"
            >
              {tag}
            </Link>
          ))}
        </div>

        <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">Curated Lists</h2>
            <Link href="/top" className="text-slate-400 hover:text-white">
              Browse Top
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {featuredTop.map((p) => (
              <Link
                key={p.slug}
                href={`/top/${p.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/20 hover:bg-slate-800 p-4"
              >
                <div className="font-bold">{p.title.replace(" - PromptInc", "")}</div>
                <div className="text-slate-400 text-sm">Open →</div>
              </Link>
            ))}
          </div>
        </section>

        {pairs.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-2xl font-bold">Quick Compare</h2>
              <Link href="/compare" className="text-slate-400 hover:text-white">
                Browse Compare
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {pairs.slice(0, 8).map((pair) => {
                const parsed = parseComparePair(pair);
                if (!parsed) return null;
                const a = games[parsed.a];
                const b = games[parsed.b];
                if (!a || !b) return null;
                return (
                  <Link
                    key={pair}
                    href={`/compare/${pair}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950/20 hover:bg-slate-800 p-4"
                  >
                    <div className="font-bold">
                      <span className="mr-2">{a.emoji}</span>
                      {a.gameName} vs <span className="ml-2 mr-2">{b.emoji}</span>
                      {b.gameName}
                    </div>
                    <div className="text-slate-400 text-sm">Open →</div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <AdSlot variant="banner" slot="tags-bottom" />
      </section>

      <Footer />
    </main>
  );
}
