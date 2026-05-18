import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug, findCategoryBySlug } from "@/lib/categories";
import { buildComparePair } from "@/lib/compare";
import { buildFaqJsonLd, inferGuideLinks, tldrForTopic, topTags } from "@/lib/seoBlocks";
import { tagToSlug } from "@/lib/tags";
import { topPages } from "@/lib/top";

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

  const topic = `${categoryName} games`;
  const tldr = tldrForTopic(topic);
  const guideLinks = inferGuideLinks(topic);
  const tags = topTags(list, 10);
  const relatedTop = topPages
    .filter((p) => p.keywords.some((k) => categoryName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(categoryName.toLowerCase())))
    .slice(0, 4);

  const faqItems = [
    {
      q: `What are ${categoryName.toLowerCase()} games?`,
      a: `These are games grouped under the ${categoryName} category on PromptInc. They share similar gameplay style and goals.`,
    },
    {
      q: "Are these games free to play?",
      a: "Yes. Games on PromptInc are free to play in your browser.",
    },
    {
      q: "How do I find similar games?",
      a: "Use Tags, Top lists, and Compare pages to discover similar games quickly.",
    },
  ];

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqItems)) }} />

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

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
          <div className="text-sm text-slate-400">TL;DR</div>
          <div className="space-y-2 text-slate-300">
            {tldr.map((b) => (
              <p key={b}>• {b}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {guideLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/compare"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
            >
              Compare games
            </Link>
          </div>
        </section>

        {relatedTop.length > 0 || tags.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="text-sm text-slate-400">Explore more</div>
            <div className="flex flex-wrap gap-2">
              {relatedTop.map((p) => (
                <Link
                  key={p.slug}
                  href={`/top/${p.slug}`}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
                >
                  {p.title.replace(" - PromptInc", "")}
                </Link>
              ))}
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
          </section>
        ) : null}

        {list.length > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-slate-300">
              Quick compare: <span className="font-bold text-white">{list[0].gameName}</span> vs{" "}
              <span className="font-bold text-white">{list[1].gameName}</span>
            </div>
            <Link
              href={`/compare/${buildComparePair(list[0].slug, list[1].slug)}`}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 font-bold"
            >
              Compare
            </Link>
          </div>
        ) : null}

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

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl bg-slate-800 p-4">
                <div className="font-bold">{item.q}</div>
                <div className="mt-2 text-slate-300">{item.a}</div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}
