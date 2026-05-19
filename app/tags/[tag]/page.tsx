import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { buildComparePair } from "@/lib/compare";
import { buildFaqJsonLd, inferGuideLinks, tldrForTopic } from "@/lib/seoBlocks";
import { findTagBySlug, tagToSlug } from "@/lib/tags";
import { topPages } from "@/lib/top";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const allTags = Array.from(new Set(Object.values(games).flatMap((g) => g.tags ?? [])));
  const name = findTagBySlug(tag, allTags);

  if (!name) {
    return { title: "Tag Not Found - PromptInc" };
  }

  return {
    title: `${name} Games - PromptInc`,
    description: `Play free online games tagged with ${name}.`,
    keywords: [`${name} games`, `${name.toLowerCase()} games online`, `games tagged ${name}`],
    alternates: {
      canonical: `/tags/${tagToSlug(name)}`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const allTags = Array.from(new Set(Object.values(games).flatMap((g) => g.tags ?? [])));
  const name = findTagBySlug(tag, allTags);
  if (!name) notFound();

  const list = Object.values(games)
    .filter((g) => (g.tags ?? []).some((t) => t.toLowerCase() === name.toLowerCase()))
    .sort((a, b) => a.gameName.localeCompare(b.gameName));

  const topic = `${name} games`;
  const tldr = tldrForTopic(topic);
  const guideLinks = inferGuideLinks(topic);
  const relatedTop = topPages
    .filter((p) => p.keywords.some((k) => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())))
    .slice(0, 4);

  const faqItems = [
    {
      q: `What does the “${name}” tag mean?`,
      a: `Games with the ${name} tag share a common theme or mechanic. Use tags to explore similar games faster.`,
    },
    {
      q: "Are tagged games free to play?",
      a: "Yes. Games on PromptInc are free to play in your browser.",
    },
    {
      q: "How do I find the best games for this tag?",
      a: "Open a Top list that matches your interests, then use Compare pages to pick between similar games.",
    },
  ];

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Tags", item: "/tags" },
      {
        "@type": "ListItem",
        position: 3,
        name: name,
        item: `/tags/${tagToSlug(name)}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqItems)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-slate-400">Tag</div>
            <h1 className="text-4xl font-bold">{name}</h1>
          </div>
          <Link href="/tags" className="text-slate-400 hover:text-white">
            Browse all tags
          </Link>
        </div>

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

        <AdSlot variant="banner" slot={`tag-${tagToSlug(name)}-top`} />

        {list.length > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-slate-300">
              Quick compare: <span className="font-bold text-white">{list[0].gameName}</span> vs{" "}
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

        {relatedTop.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
            <div className="text-sm text-slate-400">Related Top lists</div>
            <div className="flex flex-wrap gap-2">
              {relatedTop.map((p) => (
                <Link
                  key={p.slug}
                  href={`/top/${p.slug}`}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
                >
                  {p.title.replace(" - PromptInc", "")}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid md:grid-cols-2 gap-6">
          {list.map((game) => (
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

        <AdSlot variant="banner" slot={`tag-${tagToSlug(name)}-bottom`} />

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
