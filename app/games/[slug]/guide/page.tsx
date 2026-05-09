import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";
import type { FAQItem } from "@/types/game";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = games[slug];
  if (!game) {
    return {
      title: "Guide Not Found - PromptInc",
    };
  }

  const title = `${game.gameName} Guide: Tips, Strategy & FAQ`;
  const description = `Learn how to play ${game.gameName}, read tips & strategy, and improve your score. Free ${game.category} game playable in your browser.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/games/${game.slug}/guide`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/games/${game.slug}/guide`,
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

function buildDefaultFaq(gameName: string, shortDescription: string): FAQItem[] {
  return [
    { q: `Is ${gameName} free to play?`, a: "Yes. It runs in your browser and is free to play." },
    { q: `How do I improve my score in ${gameName}?`, a: "Focus on consistency first, then increase speed and risk." },
    { q: "Does it work on mobile?", a: "Yes. The UI supports touch controls and mobile-friendly layout." },
    { q: "How do I get on the leaderboard?", a: "Finish a run, submit your score, then check the leaderboard page." },
    { q: `What is the goal of ${gameName}?`, a: shortDescription },
  ];
}

export default async function GameGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const game = games[slug];
  if (!game) notFound();

  const categoryHref = `/categories/${categoryToSlug(game.category)}`;
  const faq = (game.faq && game.faq.length > 0 ? game.faq : buildDefaultFaq(game.gameName, game.shortDescription)).slice(
    0,
    10
  );

  const related = (() => {
    const all = Object.values(games).filter((g) => g.slug !== game.slug);
    const sameCategory = all.filter((g) => g.category === game.category);
    const pick = sameCategory.slice(0, 8);
    if (pick.length >= 8) return pick;
    const rest = all
      .filter((g) => g.category !== game.category)
      .sort((a, b) => a.gameName.localeCompare(b.gameName));
    return [...pick, ...rest.filter((g) => !pick.some((p) => p.slug === g.slug)).slice(0, 8 - pick.length)];
  })();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${game.gameName} Guide: Tips, Strategy & FAQ`,
    description: `Learn how to play ${game.gameName}, read tips & strategy, and improve your score.`,
    url: `/games/${game.slug}/guide`,
    image: `/games/${game.slug}/opengraph-image`,
    mainEntityOfPage: `/games/${game.slug}/guide`,
    author: {
      "@type": "Organization",
      name: "PromptInc",
    },
    publisher: {
      "@type": "Organization",
      name: "PromptInc",
    },
    about: {
      "@type": "VideoGame",
      name: game.gameName,
      genre: game.category,
      url: `/games/${game.slug}`,
      isAccessibleForFree: true,
    },
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

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Games", item: "/games" },
      { "@type": "ListItem", position: 3, name: game.gameName, item: `/games/${game.slug}` },
      { "@type": "ListItem", position: 4, name: "Guide", item: `/games/${game.slug}/guide` },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
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
            <Link href={categoryHref} className="text-slate-400 hover:text-white">
              {game.category}
            </Link>
            <Link href={`/games/${game.slug}`} className="text-slate-400 hover:text-white">
              Play
            </Link>
            <Link href={`/games/${game.slug}/leaderboard`} className="text-slate-400 hover:text-white">
              Leaderboard
            </Link>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
          </div>
        </nav>

        <header className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <div className="text-sm text-blue-400">Guide</div>
          <h1 className="text-4xl font-bold">{game.gameName} Guide</h1>
          <p className="text-slate-300">
            Tips, strategy, and FAQs to help you improve your score. If you want to play, jump back into the game anytime.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/games/${game.slug}`} className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 font-semibold">
              Play {game.gameName}
            </Link>
            <Link
              href={`/games/${game.slug}/leaderboard`}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold"
            >
              View leaderboard
            </Link>
            <Link href={categoryHref} className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
              More {game.category}
            </Link>
          </div>
        </header>

        <AdSlot variant="banner" slot={`${game.slug}-guide-top`} />

        <section className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-slate-300">
            {game.gameName} is a free {game.category} browser game. {game.description}
          </p>
          <p className="text-slate-300">
            Use this guide to learn the core mechanics, build consistent habits, and then push for higher scores.
          </p>
        </section>

        <section className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <h2 className="text-2xl font-bold">How to Play</h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-300">
            <li>Start a run and focus on understanding the controls.</li>
            <li>Prioritize survival and clean decisions over risky moves.</li>
            <li>After each run, submit your best score and compare on the leaderboard.</li>
          </ol>
          <div className="text-slate-400 text-sm">
            Pro tip: replay short sessions. Frequent retries build pattern memory faster.
          </div>
        </section>

        <AdSlot variant="inline" slot={`${game.slug}-guide-mid`} />

        <section className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <h2 className="text-2xl font-bold">Tips & Strategy</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-950/20 border border-slate-800 p-5 space-y-2">
              <div className="font-bold">Consistency beats speed</div>
              <div className="text-slate-300">
                Stable play creates long runs. Once you can stay alive, your score naturally climbs.
              </div>
            </div>
            <div className="rounded-2xl bg-slate-950/20 border border-slate-800 p-5 space-y-2">
              <div className="font-bold">Reduce unnecessary risk</div>
              <div className="text-slate-300">Avoid greedy routes. Choose paths with more escape options.</div>
            </div>
            <div className="rounded-2xl bg-slate-950/20 border border-slate-800 p-5 space-y-2">
              <div className="font-bold">Play in short focused sessions</div>
              <div className="text-slate-300">Three 5-minute runs often teach more than one long distracted run.</div>
            </div>
            <div className="rounded-2xl bg-slate-950/20 border border-slate-800 p-5 space-y-2">
              <div className="font-bold">Track your improvements</div>
              <div className="text-slate-300">
                Your personal best is saved locally. Submit scores to build a visible progress loop.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold">FAQ</h2>
            <Link href={`/games/${game.slug}`} className="text-slate-400 hover:text-white">
              Back to game →
            </Link>
          </div>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-xl bg-slate-800 p-4">
                <div className="font-bold">{item.q}</div>
                <div className="mt-2 text-slate-300">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-2xl p-8 space-y-4 border border-slate-800">
          <h2 className="text-2xl font-bold">More Games</h2>
          <p className="text-slate-300">
            Explore more games to keep the session going: similar titles, more categories, and leaderboards.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={categoryHref} className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 font-semibold">
              More {game.category}
            </Link>
            <Link href="/categories" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
              Browse categories
            </Link>
            <Link href="/leaderboards" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
              All leaderboards
            </Link>
            <Link href="/games" className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold">
              All games
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {related.slice(0, 6).map((g) => (
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

        <AdSlot variant="banner" slot={`${game.slug}-guide-bottom`} />
      </div>

      <Footer />
    </main>
  );
}
