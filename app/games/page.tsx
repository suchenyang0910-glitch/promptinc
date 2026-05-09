import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Free Online Simulator Games - PromptInc",
  description:
    "Play free online simulator games, startup games, idle games, clicker games, and business tycoon games in your browser.",
  alternates: {
    canonical: "/games",
  },
};

type PageProps = {
  searchParams?: Promise<{ q?: string; category?: string }>;
};

export default async function GamesPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim().toLowerCase();
  const category = (sp.category ?? "").trim();

  const allGames = Object.values(games);
  const categories = Array.from(new Set(allGames.map((g) => g.category))).sort();

  const gameList = allGames.filter((g) => {
    const matchQ =
      !q ||
      g.gameName.toLowerCase().includes(q) ||
      g.shortDescription.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.slug.includes(q);
    const matchCategory = !category || g.category === category;
    return matchQ && matchCategory;
  });

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Online Simulator Games",
    description:
      "Play free online simulator games, startup games, idle games, clicker games, and business tycoon games in your browser.",
    url: "/games",
    isPartOf: {
      "@type": "WebSite",
      name: "PromptInc",
      url: "/",
    },
    hasPart: allGames.map((g) => ({
      "@type": "CreativeWork",
      name: g.gameName,
      url: `/games/${g.slug}`,
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
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Free Online Simulator Games</h1>
          <p className="text-slate-400 text-lg">
            Play free browser games about AI, crypto, startups, business, and digital empires.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/categories"
            className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm"
          >
            Browse categories
          </Link>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c}
              href={`/categories/${categoryToSlug(c)}`}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-sm"
            >
              {c}
            </Link>
          ))}
        </div>

        <form className="flex flex-col gap-3 md:flex-row md:items-end" action="/games">
          <div className="flex-1">
            <label className="block text-sm text-slate-400">Search</label>
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Search games"
              className="mt-2 w-full rounded-xl p-3 bg-slate-900 border border-slate-800"
            />
          </div>

          <div className="md:w-64">
            <label className="block text-sm text-slate-400">Category</label>
            <select
              name="category"
              defaultValue={sp.category ?? ""}
              className="mt-2 w-full rounded-xl p-3 bg-slate-900 border border-slate-800"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 font-bold">
            Apply
          </button>

          <Link
            href="/games"
            className="text-slate-400 hover:text-white md:pb-3 md:pl-2"
          >
            Clear
          </Link>
        </form>

        <div className="grid md:grid-cols-2 gap-6">
          {gameList.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-4 border border-slate-800"
            >
              <div className="text-5xl">{game.emoji}</div>

              <div>
                <p className="text-sm text-blue-400">{game.category}</p>
                <h2 className="text-3xl font-bold">{game.gameName}</h2>
              </div>

              <p className="text-slate-400">{game.shortDescription}</p>

              <span className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold">Play Now</span>
            </Link>
          ))}
        </div>

        {gameList.length === 0 ? (
          <div className="text-center text-slate-400">No games found.</div>
        ) : null}
      </section>

      <Footer />
    </main>
  );
}
