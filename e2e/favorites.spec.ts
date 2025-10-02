import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should add character to favorites", async ({ page }) => {
    // Click on first character to open details
    await page.locator('[data-testid="character-card"]').first().click();

    // Add to favorites
    const favoriteButton = page.locator('[data-testid="favorite-button"]');
    await favoriteButton.click();

    // Verify favorite button state changes
    await expect(favoriteButton).toHaveClass(/text-red-500/);

    // Check favorites count in navbar
    const favoritesCount = page.locator('[data-testid="favorites-count"]');
    await expect(favoritesCount).toHaveText("1");
  });

  test("should remove character from favorites", async ({ page }) => {
    // First add a character to favorites
    await page.locator('[data-testid="character-card"]').first().click();
    await page.locator('[data-testid="favorite-button"]').click();

    // Remove from favorites
    await page.locator('[data-testid="favorite-button"]').click();

    // Verify favorite button state changes back
    await expect(
      page.locator('[data-testid="favorite-button"]')
    ).not.toHaveClass(/text-red-500/);

    // Check favorites count is 0 or hidden
    const favoritesCount = page.locator('[data-testid="favorites-count"]');
    await expect(favoritesCount).not.toBeVisible();
  });

  test("should display favorites modal", async ({ page }) => {
    // Add a character to favorites first
    await page.locator('[data-testid="character-card"]').first().click();
    await page.locator('[data-testid="favorite-button"]').click();

    // Close character detail
    await page.locator('[data-testid="close-detail"]').click();

    // Open favorites modal
    const favoritesButton = page.locator('[data-testid="favorites-button"]');
    await favoritesButton.click();

    // Verify modal is open
    await expect(page.locator('[data-testid="favorites-modal"]')).toBeVisible();

    // Verify favorite character is displayed
    await expect(page.locator('[data-testid="favorite-item"]')).toHaveCount(1);
  });

  test("should persist favorites after page reload", async ({ page }) => {
    // Add a character to favorites
    await page.locator('[data-testid="character-card"]').first().click();
    await page.locator('[data-testid="favorite-button"]').click();

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check that favorites count is still there
    const favoritesCount = page.locator('[data-testid="favorites-count"]');
    await expect(favoritesCount).toHaveText("1");
  });
});
