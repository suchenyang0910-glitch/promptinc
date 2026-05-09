import type { MetadataRoute } from "next";

import { getSiteBaseUrl } from "@/lib/site";
import { games } from "@/games";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();
  const lastModified = new Date();
  const gameUrls = Object.values(games).map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
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
    ...gameUrls,
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
