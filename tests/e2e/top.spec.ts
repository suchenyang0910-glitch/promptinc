import { expect, test } from "@playwright/test";

const pages = [
  "/top",
  "/top/best-idle-games",
  "/top/business-tycoon-games",
  "/top/ai-startup-games",
];

test("top pages load and list games", async ({ page }) => {
  for (const p of pages) {
    await page.goto(p);
    await expect(page.getByRole("heading").first()).toBeVisible();
  }

  await page.goto("/top/best-idle-games");
  await expect(page.getByTestId("top-game-card").first()).toBeVisible();

  await page.goto("/top/best-idle-games/opengraph-image");
  await expect(page).toHaveURL(/\/opengraph-image$/);
});
