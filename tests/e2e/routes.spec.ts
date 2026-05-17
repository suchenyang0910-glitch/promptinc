import { expect, test } from "@playwright/test";

const slugs = ["promptinc", "retro-snake", "brick-breaker", "classic-mines", "reaction-tap"];

test("key routes respond", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "PromptInc", exact: true })).toBeVisible();

  await page.goto("/games");
  await expect(page.getByRole("heading", { name: "Free Online Simulator Games" })).toBeVisible();

  await page.goto("/categories");
  await expect(page.getByRole("heading", { name: /categories/i })).toBeVisible();

  await page.goto("/leaderboards");
  await expect(page.getByRole("heading", { name: /leaderboards/i })).toBeVisible();

  await page.goto("/nes");
  await expect(page.getByRole("heading", { name: "NES Emulator" })).toBeVisible();

  for (const slug of slugs) {
    await page.goto(`/games/${slug}`);
    await expect(page.getByRole("heading", { name: /^About / })).toBeVisible({ timeout: 10_000 });
    await page.goto(`/games/${slug}/guide`);
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto(`/games/${slug}/leaderboard`);
    await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
  }
});
