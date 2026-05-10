import { expect, test } from "@playwright/test";

test.describe("production-only", () => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "Set PLAYWRIGHT_BASE_URL to run production tests");

function extractLocs(xml: string) {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

function isImageUrl(url: string) {
  return /\/opengraph-image$/.test(url);
}

  test("sitemap URLs respond (production-safe)", async ({ request, baseURL }) => {
  test.setTimeout(180_000);

  const sitemapUrl = new URL("/sitemap.xml", baseURL ?? "http://localhost:3100").toString();
  const sitemapRes = await request.get(sitemapUrl);
  expect(sitemapRes.status(), sitemapUrl).toBe(200);

  const xml = await sitemapRes.text();
  const urls = extractLocs(xml);
  expect(urls.length).toBeGreaterThan(10);

  const failures: Array<{ url: string; status: number; contentType: string }> = [];

  const queue = [...urls];
  const workerCount = 8;
  const workers = Array.from({ length: workerCount }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) return;

      try {
        const res = await request.get(url, { timeout: 10_000 });
        const status = res.status();
        const contentType = res.headers()["content-type"] ?? "";

        if (status >= 400) {
          failures.push({ url, status, contentType });
          continue;
        }

        if (isImageUrl(url) && !contentType.includes("image/")) {
          failures.push({ url, status, contentType });
        }
      } catch {
        failures.push({ url, status: 0, contentType: "" });
      }
    }
  });

  await Promise.all(workers);

  expect(failures).toEqual([]);
  });
});
