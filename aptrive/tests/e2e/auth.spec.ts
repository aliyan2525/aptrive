import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should redirect to login if accessing protected route", async ({ page }) => {
    // Attempting to access the dashboard directly without a session
    await page.goto("/dashboard");

    // The middleware should intercept this and redirect to login
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test("should load the login page correctly", async ({ page }) => {
    await page.goto("/login");

    // Check for essential elements
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign in/i })).toBeVisible();
  });
});
