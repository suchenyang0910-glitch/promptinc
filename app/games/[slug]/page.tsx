import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import GameMountClient from "@/components/GameMountClient";
import GamePageStats from "@/components/GamePageStats";
import GameSeoContent from "@/components/GameSeoContent";
import NativeAdBar from "@/components/NativeAdBar";
import TgPromoBar from "@/components/TgPromoBar";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";
import { tagToSlug } from "@/lib/tags";
import type { FAQItem } from "@/types/game";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = games[slug];

  if (!game) {
    return {
      title: "Game Not Found - PromptInc",
    };
  }

  const title = game.seo?.title ?? `${game.gameName} - Free Online ${game.category} Game`;
  const description = game.seo?.description ?? game.description;

  return {
    title,
    description,
    keywords: game.seo?.keywords ?? [...(game.tags ?? []), ...game.category.split(/[\s,/]+/), game.gameName].join(", "),
    alternates: {
      canonical: `/games/${game.slug}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/games/${game.slug}`,
      images: [{ url: `/games/${game.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/games/${game.slug}/opengraph-image`],
    },
  };
}

export default async function GameSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const game = games[slug];
  if (!game) notFound();

  const related = (() => {
    const all = Object.values(games).filter((g) => g.slug !== game.slug);
    const baseTags = new Set((game.tags ?? []).map((t) => t.toLowerCase()));

    function scoreCandidate(g: (typeof all)[number]) {
      let score = 0;
      if (g.category === game.category) score += 100;
      for (const t of g.tags ?? []) if (baseTags.has(t.toLowerCase())) score += 10;
      return score;
    }

    return all
      .map((g) => ({ g, s: scoreCandidate(g) }))
      .sort((a, b) => (b.s !== a.s ? b.s - a.s : a.g.gameName.localeCompare(b.g.gameName)))
      .map((x) => x.g)
      .slice(0, 6);
  })();

  const faq: FAQItem[] =
    game.faq ??
    [
      { q: `How do I play ${game.gameName}?`, a: game.shortDescription },
      { q: "Does it work on mobile?", a: "Yes. This game supports touch controls and mobile-friendly UI." },
      { q: "How do I get on the leaderboard?", a: "Finish a run, submit your score, then check the leaderboard." },
    ];

  const jsonLdVideoGame = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.gameName,
    description: game.description,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    genre: game.category,
    url: `/games/${game.slug}`,
    image: "/logo.jpg",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "PromptInc",
    },
  };

  const jsonLdSoftwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: game.gameName,
    description: game.description,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    url: `/games/${game.slug}`,
    image: "/logo.jpg",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Games", item: "/games" },
      { "@type": "ListItem", position: 3, name: game.gameName, item: `/games/${game.slug}` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVideoGame) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <Image
              src="/logo.jpg"
              alt="PromptInc logo"
              width={36}
              height={36}
              priority
              className="rounded-xl border border-slate-800 object-cover"
            />
            <span>PromptInc</span>
          </Link>

          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href={`/categories/${categoryToSlug(game.category)}`} className="text-slate-400 hover:text-white">
              {game.category}
            </Link>
            <Link href="/categories" className="text-slate-400 hover:text-white">
              Categories
            </Link>
            <Link href="/tags" className="text-slate-400 hover:text-white">
              Tags
            </Link>
            <Link href="/top" className="text-slate-400 hover:text-white">
              Top
            </Link>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white">
              Home
            </Link>
          </div>
        </nav>

        <AdSlot variant="banner" slot={`${game.slug}-top`} />

        <GamePageStats
          currentSlug={game.slug}
          allGames={Object.values(games).map((g) => ({
            slug: g.slug,
            gameName: g.gameName,
            category: g.category,
            emoji: g.emoji,
          }))}
        />

        <GameMountClient game={game} />

        <AdSlot variant="banner" slot={`${game.slug}-bottom`} />

        {/* Native ad below game */}
        <NativeAdBar />

        {/* TG channel promotion */}
        <TgPromoBar gameName={game.gameName} />

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">About {game.gameName}</h2>
          <p className="text-slate-300">{game.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/games/${game.slug}/guide`}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold"
            >
              Read guide
            </Link>
            <Link
              href={`/games/${game.slug}/leaderboard`}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold"
            >
              Leaderboard
            </Link>
          </div>

          {game.tags && game.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {game.tags.map((t) => (
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
        </section>

        <GameSeoContent game={game} />

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold">Related Games</h2>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Browse all
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950/20 hover:bg-slate-800 p-5"
                >
                  <div className="text-3xl">{g.emoji}</div>
                  <div className="mt-2 font-bold">{g.gameName}</div>
                  <div className="mt-1 text-sm text-slate-400">{g.shortDescription}</div>
                </Link>
              ))}
          </div>
        </section>

        {/* Native ad after related games */}
        <NativeAdBar />

        {/* TG channel promotion (second call-to-action) */}
        <TgPromoBar gameName={game.gameName} />

        <AdSlot variant="inline" slot={`${game.slug}-after-related`} />

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-xl bg-slate-800 p-4">
                <div className="font-bold">{item.q}</div>
                <div className="mt-2 text-slate-300">{item.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
