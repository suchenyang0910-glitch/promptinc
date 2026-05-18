import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { buildComparePair } from "@/lib/compare";
import { buildFaqJsonLd, inferGuideLinks, tldrForTopic, topTags } from "@/lib/seoBlocks";
import { categoryToSlug } from "@/lib/categories";
import { tagToSlug } from "@/lib/tags";
import { getTopGames, getTopPage, topPages } from "@/lib/top";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return topPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getTopPage(slug);
  if (!page) return { title: "Not Found - PromptInc" };

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/top/${page.slug}`,
    },
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: `/top/${page.slug}`,
      images: [{ url: `/top/${page.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`/top/${page.slug}/opengraph-image`],
    },
  };
}

export default async function TopPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getTopPage(slug);
  if (!page) notFound();

  const list = getTopGames(page, Object.values(games));
  const topic = `${page.title} ${page.keywords.join(" ")}`;
  const tldr = tldrForTopic(topic);
  const guideLinks = inferGuideLinks(topic);
  const commonTags = topTags(list, 8);
  const commonCategories = Array.from(new Set(list.map((g) => g.category))).slice(0, 6);

  const faqItems = [
    {
      q: `Are these ${page.title.replace(" - PromptInc", "")} free to play?`,
      a: "Yes. Games on PromptInc are free to play in your browser.",
    },
    {
      q: "Do I need to download anything?",
      a: "No downloads. Games run in your browser.",
    },
    {
      q: "How do I pick the best game from this list?",
      a: "Open a few games, then use Compare pages to decide based on tags and gameplay vibe.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title.replace(" - PromptInc", ""),
    description: page.description,
    itemListElement: list.slice(0, 24).map((g, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `/games/${g.slug}`,
      name: g.gameName,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqItems)) }}
        />

        <nav className="flex items-center justify-between flex-wrap gap-3">
          <Link href="/top" className="text-slate-400 hover:text-white">
            ← Top lists
          </Link>
          <div className="flex gap-4 flex-wrap text-sm">
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/categories" className="text-slate-400 hover:text-white">
              Categories
            </Link>
            <Link href="/tags" className="text-slate-400 hover:text-white">
              Tags
            </Link>
          </div>
        </nav>

        <header className="bg-slate-900 rounded-2xl p-6 space-y-2 border border-slate-800">
          <h1 className="text-4xl font-bold">{page.title.replace(" - PromptInc", "")}</h1>
          <p className="text-slate-300">{page.description}</p>
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

        {commonCategories.length > 0 || commonTags.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="text-sm text-slate-400">Explore more</div>
            <div className="flex flex-wrap gap-2">
              {commonCategories.map((c) => (
                <Link
                  key={c}
                  href={`/categories/${categoryToSlug(c)}`}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
                >
                  {c} category
                </Link>
              ))}
              {commonTags.map((t) => (
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
              Compare the top picks: <span className="font-bold text-white">{list[0].gameName}</span> vs{" "}
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

        <AdSlot variant="banner" slot={`top-${page.slug}-top`} />

        <div className="grid md:grid-cols-2 gap-6">
          {list.slice(0, 24).map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-4 border border-slate-800"
              data-testid="top-game-card"
            >
              <div className="text-5xl">{game.emoji}</div>
              <div>
                <p className="text-sm text-blue-400">{game.category}</p>
                <h2 className="text-2xl font-bold">{game.gameName}</h2>
              </div>
              <p className="text-slate-400">{game.shortDescription}</p>
              <span className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold">Play Now</span>
            </Link>
          ))}
        </div>

        <AdSlot variant="banner" slot={`top-${page.slug}-bottom`} />

        <div className="text-slate-400 text-sm">
          Want more? Browse <Link href="/games" className="text-blue-400 hover:text-blue-300">all games</Link>.
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
