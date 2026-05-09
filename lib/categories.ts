export function categoryToSlug(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCategoryBySlug(slug: string, categories: string[]) {
  const target = slug.trim().toLowerCase();
  return categories.find((c) => categoryToSlug(c) === target) ?? null;
}

