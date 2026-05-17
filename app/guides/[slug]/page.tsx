import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import { getGuidePage, guidePages } from "@/lib/guides";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return guidePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) return { title: "Not Found - PromptInc" };

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/guides/${page.slug}`,
    },
    openGraph: {
      type: "article",
      title: page.title,
      description: page.description,
      url: `/guides/${page.slug}`,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) notFound();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title.replace(" - PromptInc", ""),
    description: page.description,
    url: `/guides/${page.slug}`,
    inLanguage: "en",
    isAccessibleForFree: true,
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
      { "@type": "ListItem", position: 2, name: "Guides", item: "/guides" },
      { "@type": "ListItem", position: 3, name: page.title.replace(" - PromptInc", ""), item: `/guides/${page.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />

        <nav className="flex items-center justify-between flex-wrap gap-3">
          <Link href="/guides" className="text-slate-400 hover:text-white">
            ← Guides
          </Link>
          <div className="flex gap-4 flex-wrap text-sm">
            <Link href="/top" className="text-slate-400 hover:text-white">
              Top
            </Link>
            <Link href="/categories" className="text-slate-400 hover:text-white">
              Categories
            </Link>
            <Link href="/tags" className="text-slate-400 hover:text-white">
              Tags
            </Link>
            <Link href="/games" className="text-slate-400 hover:text-white">
              Games
            </Link>
          </div>
        </nav>

        <header className="bg-slate-900 rounded-2xl p-6 space-y-2 border border-slate-800">
          <h1 className="text-4xl font-bold">{page.title.replace(" - PromptInc", "")}</h1>
          <p className="text-slate-300">{page.description}</p>
        </header>

        <article className="space-y-6">
          {page.sections.map((s) => (
            <section key={s.heading} className="bg-slate-900 rounded-2xl p-6 space-y-3 border border-slate-800">
              <h2 className="text-2xl font-bold">{s.heading}</h2>
              <div className="space-y-2 text-slate-300">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {page.relatedLinks && page.relatedLinks.length > 0 ? (
          <section className="bg-slate-900 rounded-2xl p-6 space-y-3 border border-slate-800">
            <h2 className="text-2xl font-bold">Related</h2>
            <div className="flex flex-wrap gap-2">
              {page.relatedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm"
                >
                  {l.label}
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

