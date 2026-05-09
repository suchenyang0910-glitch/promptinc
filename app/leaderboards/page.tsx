import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Leaderboards - PromptInc",
  description: "Browse game leaderboards and compare top scores across all games.",
  alternates: {
    canonical: "/leaderboards",
  },
};

export default function LeaderboardsPage() {
  const allGames = Object.values(games);
  const categories = Array.from(new Set(allGames.map((g) => g.category))).sort();

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Leaderboards",
    description: "Browse game leaderboards and compare top scores.",
    url: "/leaderboards",
    hasPart: allGames.map((g) => ({
      "@type": "WebPage",
      name: `${g.gameName} Leaderboard`,
      url: `/games/${g.slug}/leaderboard`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdCollection),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-white">
            Home
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/categories" className="text-slate-400 hover:text-white">
              Categories
            </Link>
          </div>
        </nav>

        <header className="space-y-3">
          <h1 className="text-4xl font-bold">Leaderboards</h1>
          <p className="text-slate-400">
            Compare top scores across games. Use categories to find leaderboards faster.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/categories/${categoryToSlug(c)}`}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm"
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {allGames
            .slice()
            .sort((a, b) => a.gameName.localeCompare(b.gameName))
            .map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}/leaderboard`}
                className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800"
              >
                <div className="text-5xl">{g.emoji}</div>
                <div>
                  <div className="text-sm text-blue-400">{g.category}</div>
                  <div className="text-2xl font-bold">{g.gameName} Leaderboard</div>
                </div>
                <div className="text-slate-300">{g.shortDescription}</div>
                <div className="text-blue-400 font-semibold">View →</div>
              </Link>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

