import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { games } from "@/games";

export const metadata: Metadata = {
  title: "Free Online Simulator Games - PromptInc",
  description:
    "Play free online simulator games, startup games, idle games, clicker games, and business tycoon games in your browser.",
  alternates: {
    canonical: "/games",
  },
};

export default function GamesPage() {
  const gameList = Object.values(games);

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
    hasPart: gameList.map((g) => ({
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
      </section>

      <Footer />
    </main>
  );
}
