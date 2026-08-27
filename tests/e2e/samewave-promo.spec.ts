import { expect, test } from "@playwright/test";

test("home Samewave promotion opens the tracked public landing page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const events: unknown[][] = [];
    (window as Window & { samewaveAnalyticsEvents?: unknown[][] }).samewaveAnalyticsEvents = events;
    window.gtag = ((...args: unknown[]) => events.push(args)) as Gtag.Gtag;
  });

  const promo = page.getByTestId("samewave-promo");
  await promo.scrollIntoViewIfNeeded();

  await expect(promo).toBeVisible();
  await expect(promo).toHaveAttribute("data-ad-slot", "home-bottom");
  await expect(promo).toContainText("Discover connections with respect and boundaries");
  await expect(promo).toContainText("Explore");
  await expect(promo.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");

  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { samewaveAnalyticsEvents?: unknown[][] }).samewaveAnalyticsEvents?.some(
          (event) => event[1] === "samewave_promo_impression"
        )
      )
    )
    .toBe(true);

  const [popup] = await Promise.all([page.waitForEvent("popup"), promo.getByRole("link").click()]);
  await expect(popup).toHaveURL(
    "https://samewave.cc/?utm_source=promptinc&utm_medium=internal_ad&utm_campaign=adult_interest_discovery"
  );

  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { samewaveAnalyticsEvents?: unknown[][] }).samewaveAnalyticsEvents?.some(
          (event) => event[1] === "samewave_promo_click"
        )
      )
    )
    .toBe(true);
});
