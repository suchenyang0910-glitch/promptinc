import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
const shouldUseWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  ...(shouldUseWebServer
    ? {
        webServer: {
          command: "pnpm build && pnpm exec next start -p 3100",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }
    : {}),
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});
