import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";

type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  url: string;
};

function readAllBlogPosts(): BlogPostMeta[] {
  const blogDir = path.join(process.cwd(), "public", "blog");
  let files: string[] = [];
  try {
    files = fs.readdirSync(blogDir);
  } catch {
    return [];
  }
  const items: BlogPostMeta[] = [];
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const filePath = path.join(blogDir, f);
    let raw = "";
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }
    const slug = f.replace(/\.html$/, "");
    const titleMatch = raw.match(/<title>(.*?)<\/title>/i);
    const descMatch = raw.match(/<meta\s+name="description"\s+content="(.*?)"/i);
    const timeMatch = raw.match(/<time[^>]*datetime="([^"]+)"/i);
    const title = titleMatch?.[1]
      ? titleMatch[1].trim()
      : slug.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/-/g, " ");
    const description = descMatch?.[1]?.trim() ?? "A blog post by PromptInc.";
    const date = timeMatch?.[1] ?? (slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null);
    items.push({ slug, title, description, date, url: `/blog/${slug}` });
  }
  items.sort((a, b) => {
    const av = a.date ? new Date(a.date).getTime() : 0;
    const bv = b.date ? new Date(b.date).getTime() : 0;
    return bv - av;
  });
  return items;
}

export const metadata: Metadata = {
  title: "Blog - PromptInc",
  description:
    "PromptInc gaming blog: industry news, platform trends, hardware analysis, indie game updates, and free browser game coverage.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = readAllBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PromptInc Blog",
    description: metadata.description,
    url: "/blog",
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: p.url,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Blog</h1>
          <p className="text-slate-400 text-lg">
            Games, hardware, and industry analysis — updated every week.
          </p>
        </div>

        <AdSlot variant="banner" slot="blog-index-top" />

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={p.url}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-6 space-y-3 border border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{p.date ?? "Draft"}</span>
              </div>
              <h2 className="text-xl font-bold leading-snug">{p.title}</h2>
              <p className="text-slate-400 text-sm line-clamp-3">{p.description}</p>
              <span className="inline-block bg-blue-600 px-4 py-2 rounded-xl font-bold text-sm">
                Read Article
              </span>
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No articles yet. Check back soon!
          </div>
        ) : null}

        <AdSlot variant="banner" slot="blog-index-bottom" />
      </section>

      <Footer />
    </main>
  );
}
