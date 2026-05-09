import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { topPages } from "@/lib/top";

export const metadata: Metadata = {
  title: "Top Games - PromptInc",
  description: "Browse curated top lists like best idle games, business tycoon games, and AI startup games.",
  alternates: {
    canonical: "/top",
  },
};

export default function TopIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Top Games",
    description: "Curated lists of free online games.",
    url: "/top",
    hasPart: topPages.map((p) => ({
      "@type": "WebPage",
      name: p.title.replace(" - PromptInc", ""),
      url: `/top/${p.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Top Games</h1>
          <p className="text-slate-400 text-lg">Curated lists that help players discover what to play next.</p>
        </div>

        <AdSlot variant="banner" slot="top-index-top" />

        <div className="grid md:grid-cols-2 gap-6">
          {topPages.map((p) => (
            <Link
              key={p.slug}
              href={`/top/${p.slug}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800"
            >
              <h2 className="text-2xl font-bold">{p.title.replace(" - PromptInc", "")}</h2>
              <p className="text-slate-400">{p.description}</p>
              <span className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold">Open List</span>
            </Link>
          ))}
        </div>

        <AdSlot variant="banner" slot="top-index-bottom" />
      </section>

      <Footer />
    </main>
  );
}

