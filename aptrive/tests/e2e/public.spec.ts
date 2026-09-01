import { test, expect } from "@playwright/test";

test.describe("Public Journeys", () => {
  test("should load the homepage and primary branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Aptrive/i);

    const loginLink = page.getByRole("link", { name: /Log in/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test("should load the library page", async ({ page }) => {
    await page.goto("/library");
    await expect(page).toHaveTitle(/Library/i);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load the leaderboard page", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page).toHaveTitle(/Leaderboard/i);
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load the aggregate calculator tool page", async ({ page }) => {
    await page.goto("/tools/calculator");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText(/Aggregate Calculator/i).first()).toBeVisible();
  });

  test("should load the merit estimator tool page", async ({ page }) => {
    await page.goto("/tools/estimator");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText(/Merit Estimator/i).first()).toBeVisible();
  });

  test("should load the about and contact pages", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/contact");
    await expect(page.locator("main")).toBeVisible();
  });
});
