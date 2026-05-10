import { expect, test } from "@playwright/test";

test.describe("production-only", () => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "Set PLAYWRIGHT_BASE_URL to run production tests");

function extractAssetUrls(html: string, baseURL: string) {
  const out: string[] = [];
  const re = /<(?:link|script)[^>]+(?:href|src)="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (!raw.startsWith("/_next/")) continue;
    out.push(new URL(raw, baseURL).toString());
  }
  return Array.from(new Set(out));
}

  test("home page loads Next static assets as correct content types", async ({ request, baseURL }) => {
  const site = baseURL ?? "http://localhost:3100";
  const res = await request.get(new URL("/", site).toString());
  expect(res.status()).toBeLessThan(400);

  const html = await res.text();
  const assets = extractAssetUrls(html, site);
  expect(assets.length).toBeGreaterThan(0);

  for (const url of assets) {
    const r = await request.get(url);
    expect(r.status(), url).toBe(200);
    const ct = r.headers()["content-type"] ?? "";
    if (url.endsWith(".css")) expect(ct, url).toContain("text/css");
    if (url.endsWith(".js")) expect(ct, url).toContain("javascript");
  }
  });
});
