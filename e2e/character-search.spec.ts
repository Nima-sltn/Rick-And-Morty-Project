import { test, expect } from "@playwright/test";

test.describe("Character Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display characters on initial load", async ({ page }) => {
    // Wait for characters to load
    await expect(
      page.locator('[data-testid="character-card"]').first()
    ).toBeVisible();

    // Check that multiple characters are displayed
    const characterCards = page.locator('[data-testid="character-card"]');
    await expect(characterCards).toHaveCount(5); // API returns 5 characters per page by default
  });

  test("should search for characters", async ({ page }) => {
    // Search for "Rick"
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Rick");

    // Wait for search results
    await page.waitForTimeout(500); // Debounce delay
    await page.waitForLoadState("networkidle");

    // Verify search results contain "Rick"
    const characterNames = page.locator('[data-testid="character-name"]');
    const firstCharacterName = await characterNames.first().textContent();
    expect(firstCharacterName).toContain("Rick");
  });

  test("should clear search", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    // Enter search term
    await searchInput.fill("Morty");
    await page.waitForTimeout(500);

    // Clear search
    const clearButton = page.locator('button[aria-label="Clear search"]');
    await clearButton.click();

    // Verify search is cleared
    await expect(searchInput).toHaveValue("");
  });

  test("should handle no search results", async ({ page }) => {
    // Search for non-existent character
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("NonExistentCharacter12345");

    await page.waitForTimeout(500);
    await page.waitForLoadState("networkidle");

    // Verify no results message
    await expect(page.locator("text=No characters found")).toBeVisible();
  });
});
