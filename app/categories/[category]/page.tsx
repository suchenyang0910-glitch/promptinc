import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug, findCategoryBySlug } from "@/lib/categories";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const all = Array.from(new Set(Object.values(games).map((g) => g.category)));
  const name = findCategoryBySlug(category, all);

  if (!name) {
    return {
      title: "Category Not Found - PromptInc",
    };
  }

  return {
    title: `${name} Games - PromptInc`,
    description: `Play free online ${name} games in your browser.`,
    alternates: {
      canonical: `/categories/${categoryToSlug(name)}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const allCategories = Array.from(new Set(Object.values(games).map((g) => g.category)));
  const categoryName = findCategoryBySlug(category, allCategories);
  if (!categoryName) notFound();

  const list = Object.values(games)
    .filter((g) => g.category === categoryName)
    .sort((a, b) => a.gameName.localeCompare(b.gameName));

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Games`,
    description: `Play free online ${categoryName} games in your browser.`,
    url: `/categories/${categoryToSlug(categoryName)}`,
    hasPart: list.map((g) => ({
      "@type": "VideoGame",
      name: g.gameName,
      url: `/games/${g.slug}`,
      genre: g.category,
      isAccessibleForFree: true,
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
          <Link href="/categories" className="text-slate-400 hover:text-white">
            ← Categories
          </Link>
          <Link href="/games" className="text-slate-400 hover:text-white">
            Games
          </Link>
        </nav>

        <header className="space-y-2">
          <div className="text-sm text-blue-400">Category</div>
          <h1 className="text-4xl font-bold">{categoryName} Games</h1>
          <p className="text-slate-400">{list.length} free games you can play instantly.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {list.map((g) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800"
            >
              <div className="text-5xl">{g.emoji}</div>
              <div>
                <div className="text-sm text-slate-400">{g.category}</div>
                <div className="text-2xl font-bold">{g.gameName}</div>
              </div>
              <div className="text-slate-300">{g.shortDescription}</div>
              <div className="text-blue-400 font-semibold">Play →</div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

