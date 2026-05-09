import type { MetadataRoute } from "next";

import { getSiteBaseUrl } from "@/lib/site";
import { games } from "@/games";
import { categoryToSlug } from "@/lib/categories";
import { tagToSlug } from "@/lib/tags";
import { topPages } from "@/lib/top";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();
  const lastModified = new Date();
  const gameUrls = Object.values(games).map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const leaderboardUrls = Object.values(games).map((game) => ({
    url: `${baseUrl}/games/${game.slug}/leaderboard`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const guideUrls = Object.values(games).map((game) => ({
    url: `${baseUrl}/games/${game.slug}/guide`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const categories = Array.from(new Set(Object.values(games).map((g) => g.category)));
  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/categories/${categoryToSlug(c)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tags = Array.from(new Set(Object.values(games).flatMap((g) => g.tags ?? [])));
  const tagUrls = tags.map((t) => ({
    url: `${baseUrl}/tags/${tagToSlug(t)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.55,
  }));

  const topUrls = topPages.map((p) => ({
    url: `${baseUrl}/top/${p.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/leaderboards`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/top`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...gameUrls,
    ...leaderboardUrls,
    ...guideUrls,
    ...categoryUrls,
    ...tagUrls,
    ...topUrls,
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
