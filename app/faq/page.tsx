import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { faqPages } from "@/lib/faqPages";

export const metadata: Metadata = {
  title: "FAQ - PromptInc",
  description: "Frequently asked questions about browser games, progress, and gameplay features.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "FAQ",
    description: "Frequently asked questions about PromptInc games.",
    url: "/faq",
    hasPart: faqPages.map((p) => ({
      "@type": "WebPage",
      name: p.title.replace(" - PromptInc", ""),
      url: `/faq/${p.slug}`,
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
          <h1 className="text-4xl font-bold">FAQ</h1>
          <p className="text-slate-400">Fast answers about gameplay, progress, and common issues.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {faqPages.map((p) => (
            <Link
              key={p.slug}
              href={`/faq/${p.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-6 space-y-2"
            >
              <div className="text-sm text-slate-400">FAQ</div>
              <div className="text-2xl font-bold">{p.title.replace(" - PromptInc", "")}</div>
              <div className="text-slate-300">{p.description}</div>
            </Link>
          ))}
        </div>

        <div className="text-slate-400 text-sm text-center">
          Want longer walkthroughs? Browse <Link href="/guides" className="text-blue-400 hover:text-blue-300">Guides</Link>.
        </div>
      </section>

      <Footer />
    </main>
  );
}

