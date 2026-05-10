import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import GameLeaderboardClient from "@/components/GameLeaderboardClient";
import { games } from "@/games";

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

  return {
    title: `${game.gameName} Leaderboard - PromptInc`,
    description: `Top scores for ${game.gameName}. Compare your best score and climb the leaderboard.`,
    alternates: {
      canonical: `/games/${game.slug}/leaderboard`,
    },
    openGraph: {
      type: "website",
      title: `${game.gameName} Leaderboard - PromptInc`,
      description: `Top scores for ${game.gameName}. Compare your best score and climb the leaderboard.`,
      url: `/games/${game.slug}/leaderboard`,
      images: [{ url: `/games/${game.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.gameName} Leaderboard - PromptInc`,
      description: `Top scores for ${game.gameName}. Compare your best score and climb the leaderboard.`,
      images: [`/games/${game.slug}/opengraph-image`],
    },
  };
}

export default async function GameLeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  const game = games[slug];
  if (!game) notFound();

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Games", item: "/games" },
      { "@type": "ListItem", position: 3, name: game.gameName, item: `/games/${game.slug}` },
      { "@type": "ListItem", position: 4, name: "Leaderboard", item: `/games/${game.slug}/leaderboard` },
    ],
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${game.gameName} Leaderboard`,
    description: `Top scores for ${game.gameName}. Compare your best score and climb the leaderboard.`,
    url: `/games/${game.slug}/leaderboard`,
    isPartOf: {
      "@type": "WebSite",
      name: "PromptInc",
      url: "/",
    },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdBreadcrumbs),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebPage),
          }}
        />

        <nav className="flex items-center justify-between py-4">
          <Link href={`/games/${game.slug}`} className="text-slate-400 hover:text-white">
            ← Back
          </Link>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <Link href={`/games/${game.slug}/guide`} className="text-slate-400 hover:text-white">
              Guide
            </Link>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
          </div>
        </nav>

        <AdSlot variant="banner" slot={`${game.slug}-leaderboard-top`} />

        <header className="bg-slate-900 rounded-2xl p-6 space-y-2 border border-slate-800">
          <div className="text-sm text-blue-400">{game.category}</div>
          <h1 className="text-3xl font-bold">{game.gameName} Leaderboard</h1>
          <p className="text-slate-300">See the top scores and track your best run.</p>
        </header>

        <GameLeaderboardClient gameSlug={game.slug} />

        <AdSlot variant="banner" slot={`${game.slug}-leaderboard-bottom`} />
      </div>

      <Footer />
    </main>
  );
}
