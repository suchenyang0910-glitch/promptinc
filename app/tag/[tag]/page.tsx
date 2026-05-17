import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export default async function TagRedirectPage({ params }: PageProps) {
  const { tag } = await params;
  permanentRedirect(`/tags/${tag}`);
}

