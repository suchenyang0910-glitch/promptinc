import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { getCompareCandidates, parseComparePair } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Compare Games - PromptInc",
  description: "Compare browser games side-by-side: features, tags, and what to play next.",
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareIndexPage() {
  const all = Object.values(games);
  const pairs = getCompareCandidates(all, 2, 60);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Compare Games",
    description: "Side-by-side comparisons for browser games.",
    url: "/compare",
    hasPart: pairs.map((p) => ({
      "@type": "WebPage",
      url: `/compare/${p}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-white">
            Home
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/top" className="text-slate-400 hover:text-white">
              Top
            </Link>
            <Link href="/categories" className="text-slate-400 hover:text-white">
              Categories
            </Link>
            <Link href="/tags" className="text-slate-400 hover:text-white">
              Tags
            </Link>
          </div>
        </nav>

        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Compare Games</h1>
          <p className="text-slate-400">Side-by-side pages that help players choose what to play next.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {pairs.map((pair) => {
            const parsed = parseComparePair(pair);
            if (!parsed) return null;
            const a = games[parsed.a];
            const b = games[parsed.b];
            if (!a || !b) return null;

            return (
              <Link
                key={pair}
                href={`/compare/${pair}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-6 space-y-3"
              >
                <div className="text-sm text-slate-400">Compare</div>
                <div className="text-2xl font-bold">
                  <span className="mr-2">{a.emoji}</span>
                  {a.gameName} vs <span className="ml-2 mr-2">{b.emoji}</span>
                  {b.gameName}
                </div>
                <div className="text-slate-300">{a.category} · {b.category}</div>
                <div className="text-blue-400 font-semibold">Open comparison →</div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}

