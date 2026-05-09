import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import GameEngine from "@/components/GameEngine";
import SnakeGame from "@/components/SnakeGame";
import AirStrikeGame from "@/components/retro/AirStrikeGame";
import BoxPuzzleGame from "@/components/retro/BoxPuzzleGame";
import BrickBreakerGame from "@/components/retro/BrickBreakerGame";
import BubbleShooterGame from "@/components/retro/BubbleShooterGame";
import CoinCatcherGame from "@/components/retro/CoinCatcherGame";
import MergeFruitGame from "@/components/retro/MergeFruitGame";
import MinesGame from "@/components/retro/MinesGame";
import ColorSortGame from "@/components/retro/ColorSortGame";
import MemoryFlipGame from "@/components/retro/MemoryFlipGame";
import NumberMergeGame from "@/components/retro/NumberMergeGame";
import ReactionTapGame from "@/components/retro/ReactionTapGame";
import TetrisGame from "@/components/retro/TetrisGame";
import TileMatchGame from "@/components/retro/TileMatchGame";
import WordConnectGame from "@/components/retro/WordConnectGame";
import { games } from "@/games";
import type { FAQItem, GameType } from "@/types/game";

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
    title: `${game.gameName} - Free Online ${game.category} Game`,
    description: game.description,
    alternates: {
      canonical: `/games/${game.slug}`,
    },
    openGraph: {
      type: "website",
      title: `${game.gameName} - Free Online ${game.category} Game`,
      description: game.description,
      url: `/games/${game.slug}`,
      images: [{ url: "/logo.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.gameName} - Free Online ${game.category} Game`,
      description: game.description,
      images: ["/logo.jpg"],
    },
  };
}

export default async function GameSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const game = games[slug];
  if (!game) notFound();

  const renderers: Record<GameType, ReactElement> = {
    idle: <GameEngine game={game} />,
    snake: <SnakeGame game={game} />,
    tetris: <TetrisGame game={game} />,
    brick_breaker: <BrickBreakerGame game={game} />,
    mines: <MinesGame game={game} />,
    tile_match: <TileMatchGame game={game} />,
    bubble_shooter: <BubbleShooterGame game={game} />,
    coin_catcher: <CoinCatcherGame game={game} />,
    air_strike: <AirStrikeGame game={game} />,
    box_puzzle: <BoxPuzzleGame game={game} />,
    merge_fruit: <MergeFruitGame game={game} />,
    number_merge: <NumberMergeGame game={game} />,
    color_sort: <ColorSortGame game={game} />,
    word_connect: <WordConnectGame game={game} />,
    memory_flip: <MemoryFlipGame game={game} />,
    reaction_tap: <ReactionTapGame game={game} />,
  };

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

          <div className="flex items-center gap-4 text-sm">
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white">
              Home
            </Link>
          </div>
        </nav>

        <AdSlot />

        {renderers[game.gameType]}

        <AdSlot />

        <section className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">About {game.gameName}</h2>
          <p className="text-slate-300">{game.description}</p>
        </section>

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
