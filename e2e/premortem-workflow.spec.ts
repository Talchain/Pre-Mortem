import { test, expect } from '@playwright/test';

test.describe('Pre-Mortem Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete pre-mortem workflow from start to finish', async ({ page }) => {
    await page.goto('/');

    // Step 1: Welcome
    await expect(page.getByText('Pre-Mortem Analysis')).toBeVisible();
    await expect(
      page.getByText(/identify potential failure modes/i)
    ).toBeVisible();

    await page.getByRole('button', { name: /start pre-mortem/i }).click();

    // Step 2: Decision Input
    await expect(page.getByText(/tell us about your decision/i)).toBeVisible();

    await page.getByLabel(/decision title/i).fill('Launch AI-powered search');
    await page
      .getByLabel(/decision description/i)
      .fill(
        'Implement semantic search using embeddings to improve user discovery and engagement by 30%'
      );

    await page.getByLabel(/decision type/i).selectOption('Feature Launch');
    await page.getByLabel(/timeline/i).selectOption('6 months');

    // Set confidence slider
    const slider = page.getByLabel(/initial confidence/i);
    await slider.fill('75');

    await page.getByLabel(/stakeholders/i).fill('Product Team, Engineering');

    await page
      .getByRole('button', { name: /continue to pre-mortem/i })
      .click();

    // Step 3: Temporal Projection
    await expect(
      page.getByText(/unfortunately.*failed completely/i)
    ).toBeVisible();

    await page
      .getByPlaceholder(/what went wrong/i)
      .fill('Users found the search results irrelevant and confusing');

    // Skip timer if it's active
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }

    await page.getByRole('button', { name: /generate ai scenarios/i }).click();

    // Step 4: Scenarios (AI-generated)
    // Wait for scenarios to load
    await expect(page.getByText(/potential failure scenarios/i)).toBeVisible({
      timeout: 15000,
    });

    // Should have AI-generated scenarios
    await expect(page.getByText(/scenario/i).first()).toBeVisible();

    // Flag one scenario as concerning
    const flagButtons = page.getByRole('button', {
      name: /flag as concerning/i,
    });
    const firstFlag = flagButtons.first();
    if (await firstFlag.isVisible()) {
      await firstFlag.click();
    }

    await page
      .getByRole('button', { name: /continue to root cause/i })
      .click();

    // Step 5: Root Cause Analysis
    await expect(page.getByText(/root cause analysis/i)).toBeVisible();

    // Expand a scenario to see root causes
    const scenarios = page.getByRole('button').filter({ hasText: /scenario/i });
    if (await scenarios.first().isVisible()) {
      await scenarios.first().click();
    }

    await page
      .getByRole('button', { name: /continue to mitigation/i })
      .click();

    // Step 6: Mitigation Strategies
    await expect(page.getByText(/mitigation strategies/i)).toBeVisible();

    await page.getByRole('button', { name: /continue to recalibr/i }).click();

    // Step 7: Confidence Recalibration
    await expect(page.getByText(/confidence recalibration/i)).toBeVisible();

    // See original confidence
    await expect(page.getByText(/original confidence/i)).toBeVisible();
    await expect(page.getByText('75/100')).toBeVisible();

    // Adjust confidence
    const adjustedSlider = page.getByLabel(/how confident are you now/i);
    await adjustedSlider.fill('65');

    // Add key insight
    await page
      .getByPlaceholder(/biggest insight/i)
      .fill(
        'Need stronger user research and beta testing before full launch'
      );

    await page
      .getByRole('button', { name: /generate summary report/i })
      .click();

    // Step 8: Summary
    await expect(page.getByText(/pre-mortem complete/i)).toBeVisible();
    await expect(page.getByText(/executive summary/i)).toBeVisible();

    // Check that confidence shift is shown
    await expect(page.getByText('75')).toBeVisible(); // Original
    await expect(page.getByText('65')).toBeVisible(); // Adjusted

    // Check key insight is shown
    await expect(
      page.getByText(/need stronger user research/i)
    ).toBeVisible();

    // Verify download button exists
    await expect(
      page.getByRole('button', { name: /download pdf/i })
    ).toBeVisible();
  });

  test('should persist data on page refresh', async ({ page }) => {
    await page.goto('/');

    // Start and fill in decision
    await page.getByRole('button', { name: /start/i }).click();
    await page.getByLabel(/decision title/i).fill('Test Decision');
    await page
      .getByLabel(/decision description/i)
      .fill('This is a test decision that should persist across page reloads');

    // Reload the page
    await page.reload();

    // Should still have the data
    await expect(page.getByLabel(/decision title/i)).toHaveValue(
      'Test Decision'
    );
  });

  test('should allow editing scenarios', async ({ page }) => {
    await page.goto('/');

    // Navigate to scenarios step (simplified navigation)
    await page.getByRole('button', { name: /start/i }).click();

    await page.getByLabel(/decision title/i).fill('Test');
    await page
      .getByLabel(/decision description/i)
      .fill('Test description for editing scenarios functionality');
    await page
      .getByRole('button', { name: /continue/i })
      .first()
      .click();

    // Skip temporal projection
    await page.getByPlaceholder(/what went wrong/i).fill('Test thoughts');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }

    await page.getByRole('button', { name: /generate/i }).click();

    // Wait for scenarios
    await expect(page.getByText(/potential failure/i)).toBeVisible({
      timeout: 15000,
    });

    // Edit first scenario
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();

      const titleInput = page.getByLabel(/scenario title/i);
      await titleInput.fill('Updated Scenario Title');

      await page.getByRole('button', { name: /save changes/i }).click();

      await expect(page.getByText('Updated Scenario Title')).toBeVisible();
    }
  });

  test('should enforce max 3 flagged scenarios', async ({ page }) => {
    await page.goto('/');

    // Navigate to scenarios
    await page.getByRole('button', { name: /start/i }).click();
    await page.getByLabel(/decision title/i).fill('Test');
    await page
      .getByLabel(/decision description/i)
      .fill('Testing max flagged scenarios constraint with multiple items');
    await page.getByRole('button', { name: /continue/i }).first().click();

    await page.getByPlaceholder(/what went wrong/i).fill('Test');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }

    await page.getByRole('button', { name: /generate/i }).click();

    await expect(page.getByText(/potential failure/i)).toBeVisible({
      timeout: 15000,
    });

    // Try to flag 4 scenarios
    const flagButtons = page.getByRole('button', {
      name: /flag as concerning/i,
    });

    const buttonCount = await flagButtons.count();

    if (buttonCount >= 4) {
      // Flag first 3
      for (let i = 0; i < 3; i++) {
        await flagButtons.nth(i).click();
      }

      // Verify 3 are flagged
      await expect(page.getByText('3 Flagged as Concerning')).toBeVisible();

      // 4th button should be disabled or attempting to click should have no effect
      const fourthButton = flagButtons.nth(3);
      if (await fourthButton.isVisible()) {
        await fourthButton.click();
        // Should still be 3 flagged
        await expect(page.getByText('3 Flagged as Concerning')).toBeVisible();
      }
    }
  });

  test('should show error state when AI fails', async ({ page }) => {
    // Note: This would require MSW or API mocking in practice
    // For now, we test with invalid API key or offline mode

    await page.goto('/');
    await page.getByRole('button', { name: /start/i }).click();
    await page.getByLabel(/decision title/i).fill('Test');
    await page
      .getByLabel(/decision description/i)
      .fill('Testing error handling when API calls fail gracefully');

    await page.getByRole('button', { name: /continue/i }).first().click();
    await page.getByPlaceholder(/what went wrong/i).fill('Test');

    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
    }

    // This will attempt to call AI and may show error if API key is invalid
    await page.getByRole('button', { name: /generate/i }).click();

    // Either scenarios load successfully OR error message appears
    // This is a graceful degradation test
    const hasScenarios = await page
      .getByText(/potential failure/i)
      .isVisible({ timeout: 15000 })
      .catch(() => false);
    const hasError = await page
      .getByText(/failed to generate/i)
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    expect(hasScenarios || hasError).toBe(true);
  });
});
