export function tagToSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findTagBySlug(slug: string, tags: string[]) {
  const target = slug.trim().toLowerCase();
  return tags.find((t) => tagToSlug(t) === target) ?? null;
}

