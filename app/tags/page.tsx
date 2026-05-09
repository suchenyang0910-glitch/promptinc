import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { games } from "@/games";
import { tagToSlug } from "@/lib/tags";

export const metadata: Metadata = {
  title: "Tags - PromptInc",
  description: "Browse games by tags like idle, tycoon, puzzle, retro, and more.",
  alternates: {
    canonical: "/tags",
  },
};

export default function TagsPage() {
  const allTags = Object.values(games)
    .flatMap((g) => g.tags ?? [])
    .map((t) => t.trim())
    .filter(Boolean);

  const tags = Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Tags</h1>
          <p className="text-slate-400 text-lg">Explore games by topic and style.</p>
        </div>

        <AdSlot variant="banner" slot="tags-top" />

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tagToSlug(tag)}`}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 font-semibold"
            >
              {tag}
            </Link>
          ))}
        </div>

        <AdSlot variant="banner" slot="tags-bottom" />
      </section>

      <Footer />
    </main>
  );
}

