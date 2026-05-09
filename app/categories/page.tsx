import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Game Categories - PromptInc",
  description: "Browse free online games by category: Retro Arcade, Idle, Puzzle, and more.",
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesPage() {
  const allGames = Object.values(games);
  const categoryCounts = new Map<string, number>();
  for (const g of allGames) {
    categoryCounts.set(g.category, (categoryCounts.get(g.category) ?? 0) + 1);
  }

  const categories = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count, slug: categoryToSlug(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Game Categories",
    description: "Browse free online games by category.",
    url: "/categories",
    hasPart: categories.map((c) => ({
      "@type": "CollectionPage",
      name: c.name,
      url: `/categories/${c.slug}`,
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
          <Link href="/games" className="text-slate-400 hover:text-white">
            Games
          </Link>
        </nav>

        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Game Categories</h1>
          <p className="text-slate-400">Browse games by category for faster discovery.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-6"
            >
              <div className="text-sm text-slate-400">Category</div>
              <div className="mt-1 text-2xl font-bold">{c.name}</div>
              <div className="mt-2 text-slate-300">{c.count} games</div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

