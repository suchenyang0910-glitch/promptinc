import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryRedirectPage({ params }: PageProps) {
  const { category } = await params;
  permanentRedirect(`/categories/${category}`);
}

