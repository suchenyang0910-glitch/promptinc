import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { getCompareCandidates, parseComparePair } from "@/lib/compare";
import { topTags } from "@/lib/seoBlocks";
import { tagToSlug } from "@/lib/tags";
import { topPages } from "@/lib/top";

export const metadata: Metadata = {
  title: "Top Games - PromptInc",
  description: "Browse curated top lists like best idle games, business tycoon games, and AI startup games.",
  alternates: {
    canonical: "/top",
  },
};

export default function TopIndexPage() {
  const all = Object.values(games);
  const tags = topTags(all, 12);
  const pairs = getCompareCandidates(all, 2, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Top Games",
    description: "Curated lists of free online games.",
    url: "/top",
    hasPart: topPages.map((p) => ({
      "@type": "WebPage",
      name: p.title.replace(" - PromptInc", ""),
      url: `/top/${p.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Top Games</h1>
          <p className="text-slate-400 text-lg">Curated lists that help players discover what to play next.</p>
        </div>

        <AdSlot variant="banner" slot="top-index-top" />

        <div className="grid md:grid-cols-2 gap-6">
          {topPages.map((p) => (
            <Link
              key={p.slug}
              href={`/top/${p.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800"
            >
              <h2 className="text-2xl font-bold">{p.title.replace(" - PromptInc", "")}</h2>
              <p className="text-slate-400">{p.description}</p>
              <span className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold">Open List</span>
            </Link>
          ))}
        </div>

        <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">Explore More</h2>
            <div className="flex gap-3 text-sm">
              <Link href="/compare" className="text-slate-400 hover:text-white">
                Compare
              </Link>
              <Link href="/tags" className="text-slate-400 hover:text-white">
                Tags
              </Link>
            </div>
          </div>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${tagToSlug(t)}`}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
                >
                  #{t}
                </Link>
              ))}
            </div>
          ) : null}

          {pairs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {pairs.slice(0, 6).map((pair) => {
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
                    <div className="text-sm text-slate-400">Quick compare</div>
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
          ) : null}
        </section>

        <AdSlot variant="banner" slot="top-index-bottom" />
      </section>

      <Footer />
    </main>
  );
}
