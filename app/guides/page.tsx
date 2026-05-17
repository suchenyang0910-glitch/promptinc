import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { guidePages } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides - PromptInc",
  description: "Beginner guides, strategies, and tutorials for browser games.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guides",
    description: "Guides and strategies for browser games.",
    url: "/guides",
    hasPart: guidePages.map((p) => ({
      "@type": "Article",
      headline: p.title.replace(" - PromptInc", ""),
      url: `/guides/${p.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-white">
            Home
          </Link>
          <Link href="/games" className="text-slate-400 hover:text-white">
            Games
          </Link>
        </nav>

        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Guides</h1>
          <p className="text-slate-400">Beginner-friendly guides and strategies to help you progress faster.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {guidePages.map((p) => (
            <Link
              key={p.slug}
              href={`/guides/${p.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-6 space-y-2"
            >
              <div className="text-sm text-slate-400">Guide</div>
              <div className="text-2xl font-bold">{p.title.replace(" - PromptInc", "")}</div>
              <div className="text-slate-300">{p.description}</div>
            </Link>
          ))}
        </div>

        <div className="text-slate-400 text-sm text-center">
          Looking for quick answers? Browse <Link href="/faq" className="text-blue-400 hover:text-blue-300">FAQ</Link>.
        </div>
      </section>

      <Footer />
    </main>
  );
}

