import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import Footer from "@/components/Footer";
import { games } from "@/games";
import { buildComparePair, getCompareCandidates, parseComparePair } from "@/lib/compare";
import { categoryToSlug } from "@/lib/categories";
import { tagToSlug } from "@/lib/tags";

type PageProps = {
  params: Promise<{ pair: string }>;
};

export async function generateStaticParams() {
  const all = Object.values(games);
  return getCompareCandidates(all, 2, 200).map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseComparePair(pair);
  if (!parsed) return { title: "Not Found - PromptInc" };
  const a = games[parsed.a];
  const b = games[parsed.b];
  if (!a || !b) return { title: "Not Found - PromptInc" };

  const canonicalPair = buildComparePair(a.slug, b.slug);
  const title = `${a.gameName} vs ${b.gameName} - PromptInc`;
  const description = `Compare ${a.gameName} and ${b.gameName}: categories, tags, and what to play next.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/compare/${canonicalPair}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/compare/${canonicalPair}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function intersectTags(a?: string[], b?: string[]) {
  const left = new Set((a ?? []).map((t) => t.toLowerCase()));
  return (b ?? []).filter((t) => left.has(t.toLowerCase()));
}

export default async function ComparePairPage({ params }: PageProps) {
  const { pair } = await params;
  const parsed = parseComparePair(pair);
  if (!parsed) notFound();
  const a = games[parsed.a];
  const b = games[parsed.b];
  if (!a || !b) notFound();

  const canonicalPair = buildComparePair(a.slug, b.slug);
  if (canonicalPair !== pair) {
    permanentRedirect(`/compare/${canonicalPair}`);
  }

  const sharedTags = intersectTags(a.tags, b.tags).slice(0, 8);
  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "/compare" },
      { "@type": "ListItem", position: 3, name: `${a.gameName} vs ${b.gameName}`, item: `/compare/${canonicalPair}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${a.gameName} vs ${b.gameName}`,
    description: `Compare ${a.gameName} and ${b.gameName}.`,
    url: `/compare/${canonicalPair}`,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="flex items-center justify-between flex-wrap gap-3">
          <Link href="/compare" className="text-slate-400 hover:text-white">
            ← Compare
          </Link>
          <div className="flex gap-4 flex-wrap text-sm">
            <Link href="/top" className="text-slate-400 hover:text-white">
              Top
            </Link>
            <Link href="/guides" className="text-slate-400 hover:text-white">
              Guides
            </Link>
            <Link href="/faq" className="text-slate-400 hover:text-white">
              FAQ
            </Link>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
          </div>
        </nav>

        <header className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="text-sm text-slate-400">Comparison</div>
          <h1 className="text-4xl font-bold">
            <span className="mr-2">{a.emoji}</span>
            {a.gameName} vs <span className="ml-2 mr-2">{b.emoji}</span>
            {b.gameName}
          </h1>
          <p className="text-slate-300">Compare categories, tags, and gameplay vibe — then pick what to play next.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {[a, b].map((g) => (
            <div key={g.slug} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-blue-400">{g.category}</div>
                  <div className="text-3xl font-bold">{g.gameName}</div>
                </div>
                <div className="text-5xl">{g.emoji}</div>
              </div>

              <div className="text-slate-300">{g.shortDescription}</div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/games/${g.slug}`}
                  className="inline-block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-bold"
                >
                  Play
                </Link>
                <Link
                  href={`/categories/${categoryToSlug(g.category)}`}
                  className="inline-block bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl font-semibold"
                >
                  Category
                </Link>
              </div>

              {g.tags && g.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {g.tags.slice(0, 10).map((t) => (
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
            </div>
          ))}
        </div>

        {sharedTags.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h2 className="text-2xl font-bold">Shared Tags</h2>
            <div className="flex flex-wrap gap-2">
              {sharedTags.map((t) => (
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
      </section>

      <Footer />
    </main>
  );
}
