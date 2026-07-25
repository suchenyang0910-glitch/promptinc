import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "public", "blog");
  let files: string[] = [];
  try {
    files = fs.readdirSync(blogDir);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.endsWith(".html"))
    .map((f) => ({ slug: f.replace(/\.html$/, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "public", "blog", `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    return { title: "Blog - PromptInc" };
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const titleMatch = raw.match(/<title>(.*?)<\/title>/i);
  const descMatch = raw.match(/<meta\s+name="description"\s+content="(.*?)"/i);
  return {
    title: titleMatch?.[1] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: descMatch?.[1] ?? `Blog post by PromptInc`,
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "public", "blog", `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const html = fs.readFileSync(filePath, "utf-8");

  // Extract body content from full HTML document
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch?.[1] ?? html;

  return (
    <article
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: bodyContent }}
    />
  );
}
