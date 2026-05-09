import { expect, test, type Page, type Route } from "@playwright/test";

function mockSupabaseLeaderboard(page: Page, gameSlug: string) {
  let submittedName = "Tester";
  let submittedScore = 123;

  page.route("**/rest/v1/**", async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method === "POST" && url.includes("/rest/v1/game_scores")) {
      try {
        const raw = route.request().postData() ?? "";
        const body = JSON.parse(raw);
        submittedName = String(body.player_name ?? submittedName);
        submittedScore = Number(body.score ?? submittedScore);
      } catch {
        return;
      }

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify([{ id: "00000000-0000-0000-0000-000000000000" }]),
      });
      return;
    }

    if (method === "GET" && url.includes("/rest/v1/total_scores") && url.includes(`game_slug=eq.${gameSlug}`)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            game_slug: gameSlug,
            player_name: submittedName,
            score: submittedScore,
            created_at: new Date().toISOString(),
          },
        ]),
      });
      return;
    }

    if (method === "GET" && url.includes("/rest/v1/daily_scores") && url.includes(`game_slug=eq.${gameSlug}`)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            game_slug: gameSlug,
            player_name: submittedName,
            score: submittedScore,
            created_at: new Date().toISOString(),
            day: new Date().toISOString(),
          },
        ]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
}

test("sitemap covers core traffic pages", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
  const xml = (await res?.text()) ?? "";

  expect(xml).toContain("/top/best-idle-games");
  expect(xml).toContain("/tags");
  expect(xml).toContain("/categories");
  expect(xml).toContain("/games/retro-snake/guide");
});

test("top opengraph image renders", async ({ page }) => {
  const res = await page.goto("/top/best-idle-games/opengraph-image");
  expect(res?.status()).toBe(200);
  expect(res?.headers()["content-type"]).toContain("image/");
});

test("idle daily bonus can be claimed", async ({ page }) => {
  await page.goto("/games/promptinc");

  const money = page.getByTestId("idle-money");
  await expect(money).toBeVisible();
  const before = await money.textContent();

  await page.waitForTimeout(50);

  const claim = page.getByRole("button", { name: "Claim Daily Bonus" });
  if (await claim.isVisible()) {
    await claim.click();
    await expect(money).not.toHaveText(before ?? "");
  }
});

test("game over -> submit score -> leaderboard updates (mocked)", async ({ page }) => {
  mockSupabaseLeaderboard(page, "retro-snake");

  await page.goto("/games/retro-snake");
  await page.getByTestId("snake-primary").click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("snake-gameover")).toBeVisible({ timeout: 5000 });

  const submitSection = page.locator("section", { has: page.getByRole("heading", { name: "Submit Score" }) });
  await expect(submitSection).toBeVisible();

  await submitSection.getByRole("textbox").fill("Tester");
  await submitSection.getByRole("button", { name: /^Submit\s+/ }).click();
  await expect(page.getByText("Score submitted!")).toBeVisible();

  await expect(page.getByText(/#1\s+Tester/)).toBeVisible();
});
