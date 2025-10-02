import { test, expect } from "@playwright/test";

test.describe("Character Details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should open character details", async ({ page }) => {
    // Click on first character
    const firstCharacter = page
      .locator('[data-testid="character-card"]')
      .first();
    await firstCharacter.click();

    // Verify detail panel opens
    await expect(
      page.locator('[data-testid="character-detail"]')
    ).toBeVisible();

    // Verify character information is displayed
    await expect(
      page.locator('[data-testid="character-detail-name"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="character-detail-status"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="character-detail-species"]')
    ).toBeVisible();
  });

  test("should close character details", async ({ page }) => {
    // Open character details
    await page.locator('[data-testid="character-card"]').first().click();
    await expect(
      page.locator('[data-testid="character-detail"]')
    ).toBeVisible();

    // Close details
    const closeButton = page.locator('[data-testid="close-detail"]');
    await closeButton.click();

    // Verify detail panel is closed
    await expect(
      page.locator('[data-testid="character-detail"]')
    ).not.toBeVisible();
  });

  test("should display character episodes", async ({ page }) => {
    // Open character details
    await page.locator('[data-testid="character-card"]').first().click();

    // Wait for episodes to load
    await page.waitForLoadState("networkidle");

    // Verify episodes section is visible
    await expect(
      page.locator('[data-testid="character-episodes"]')
    ).toBeVisible();

    // Verify at least one episode is displayed
    await expect(
      page.locator('[data-testid="episode-item"]').first()
    ).toBeVisible();
  });
});
