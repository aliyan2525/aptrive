import { test, expect } from "@playwright/test";

test.describe("Public Journeys", () => {
  test("should load the homepage and primary sections", async ({ page }) => {
    await page.goto("/");

    // Verify title or some known text on homepage
    // Assuming the homepage has the "Aptrive" branding
    await expect(page).toHaveTitle(/Aptrive/i);

    // Verify a call to action exists (like "Start learning" or similar)
    // The exact text depends on the hero component, we'll check for generic links
    const loginLink = page.getByRole("link", { name: /Log in/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test("should load the library page", async ({ page }) => {
    await page.goto("/library");
    await expect(page).toHaveTitle(/Library/i);
    // Ensure the 3D canvas (if any) or content container is mounted
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load the leaderboard page", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page).toHaveTitle(/Leaderboard/i);
    await expect(page.locator("main")).toBeVisible();
  });
});
