import { expect, test } from "@playwright/test";

test("idle game click increases money", async ({ page }) => {
  await page.goto("/games/promptinc");
  const money = page.getByTestId("idle-money");
  await expect(money).toBeVisible();
  const before = await money.textContent();
  await page.getByTestId("idle-click").click();
  await expect(money).not.toHaveText(before ?? "");
});

test("retro shell start/pause toggles playing state", async ({ page }) => {
  await page.goto("/games/reaction-tap");
  await page.getByTestId("retro-primary").click();
  await expect(page.getByTestId("retro-playing")).toBeVisible();
  await page.getByTestId("retro-primary").click();
  await expect(page.getByTestId("retro-playing")).toBeHidden();
});

test("snake reaches game over when hitting wall", async ({ page }) => {
  await page.goto("/games/retro-snake");
  await page.getByTestId("snake-primary").click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("snake-gameover")).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("heading", { name: "Submit Score" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Leaderboard" })).toBeVisible();
});

test("guide and leaderboard pages load", async ({ page }) => {
  await page.goto("/games/retro-snake/guide");
  await expect(page.getByRole("heading", { name: /guide/i })).toBeVisible();
  await page.goto("/games/retro-snake/leaderboard");
  await expect(page.getByRole("heading", { name: /leaderboard/i })).toBeVisible();
});
