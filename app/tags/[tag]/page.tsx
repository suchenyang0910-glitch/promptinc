import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { buildComparePair } from "@/lib/compare";
import { findTagBySlug, tagToSlug } from "@/lib/tags";

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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-slate-400">Tag</div>
            <h1 className="text-4xl font-bold">{name}</h1>
          </div>
          <Link href="/tags" className="text-slate-400 hover:text-white">
            Browse all tags
          </Link>
        </div>

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
      </section>

      <Footer />
    </main>
  );
}
