/**
 * E2E Tests: Data Persistence & Schema Validation
 * Tests session storage, data integrity, and schema conformance
 */

import { test, expect } from '@playwright/test';

test.describe('Session Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should save session to localStorage', async ({ page }) => {
    await page.goto('/');

    // Start a session
    await page.getByRole('textbox', { name: /what decision/i }).fill('Should we expand to Asia?');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for session to initialize
    await page.waitForTimeout(2000);

    // Check localStorage
    const sessionData = await page.evaluate(() => {
      return localStorage.getItem('decision_session');
    });

    expect(sessionData).toBeTruthy();
    expect(sessionData).toContain('expand to Asia');
  });

  test('should restore session on page reload', async ({ page }) => {
    await page.goto('/');

    // Start session and add content
    await page.getByRole('textbox', { name: /what decision/i }).fill('Test Persistence');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();

    // Session should be restored
    await expect(page.getByText(/Test Persistence/i)).toBeVisible();
  });

  test('should preserve conversation history across reloads', async ({ page }) => {
    await page.goto('/');

    // Start conversation
    await page.getByRole('textbox', { name: /what decision/i }).fill('History Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(2000);

    // Send a message
    const chatInput = page.getByRole('textbox', { name: /type your message/i });
    if (await chatInput.isVisible({ timeout: 3000 })) {
      await chatInput.fill('This is a test message');
      await page.getByRole('button', { name: /send/i }).click();

      await page.waitForTimeout(1000);

      // Reload
      await page.reload();

      // Message should still be visible
      await expect(page.getByText(/This is a test message/i)).toBeVisible();
    }
  });

  test('should handle multiple concurrent sessions', async ({ browser }) => {
    // Open two tabs
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('/');
    await page2.goto('/');

    // Start different sessions in each tab
    await page1.getByRole('textbox', { name: /what decision/i }).fill('Session 1 Decision');
    await page1.getByRole('button', { name: /start/i }).click();

    await page2.getByRole('textbox', { name: /what decision/i }).fill('Session 2 Decision');
    await page2.getByRole('button', { name: /start/i }).click();

    await page1.waitForTimeout(2000);
    await page2.waitForTimeout(2000);

    // Each tab should have its own session
    // But since they share localStorage, the last one wins
    // This is expected behavior - test that it doesn't crash
    await expect(page1.getByText(/Session/i)).toBeVisible();
    await expect(page2.getByText(/Session/i)).toBeVisible();

    await context.close();
  });

  test('should clear session when reset is triggered', async ({ page }) => {
    await page.goto('/');

    // Start session
    await page.getByRole('textbox', { name: /what decision/i }).fill('Reset Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(2000);

    // Find reset/new session button
    const resetButton = page.getByRole('button', { name: /new analysis/i }).or(page.getByRole('button', { name: /reset/i }));

    if (await resetButton.isVisible({ timeout: 2000 })) {
      await resetButton.click();

      // Session should be cleared
      await expect(page.getByText(/Reset Test/i)).not.toBeVisible();

      // Should be back to welcome screen
      await expect(page.getByRole('textbox', { name: /what decision/i })).toBeVisible();
    }
  });
});

test.describe('Data Integrity', () => {
  test('should validate session data structure', async ({ page }) => {
    await page.goto('/');

    // Start session
    await page.getByRole('textbox', { name: /what decision/i }).fill('Validation Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(2000);

    // Check that stored data has required fields
    const session = await page.evaluate(() => {
      const data = localStorage.getItem('decision_session');
      return data ? JSON.parse(data) : null;
    });

    expect(session).toBeTruthy();
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('type');
    expect(session).toHaveProperty('created_at');
    expect(session).toHaveProperty('decision');
    expect(session.decision).toHaveProperty('question');
  });

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.goto('/');

    // Inject corrupted data
    await page.evaluate(() => {
      localStorage.setItem('decision_session', 'invalid json {{{');
    });

    // Reload
    await page.reload();

    // App should not crash, should show welcome screen
    await expect(page.getByRole('textbox', { name: /what decision/i })).toBeVisible();
  });

  test('should maintain referential integrity in session data', async ({ page }) => {
    // After generating scenarios:
    // 1. Check that scenario IDs are unique
    // 2. Check that root cause references are valid
    // 3. Check that mitigation scenario_ids link to real scenarios

    test.skip('Requires full session with generated data');
  });
});

test.describe('Schema Validation (v1 Types)', () => {
  test('should conform to PreMortemDecision.v1 schema', async ({ page }) => {
    // This test would:
    // 1. Generate a complete session with all data
    // 2. Extract session JSON
    // 3. Validate against PreMortemDecision.v1 schema
    // 4. Check Zod validation passes

    test.skip('Requires Zod validation in E2E context');
  });

  test('should include diagnostics in session data', async ({ page }) => {
    await page.goto('/');

    // Start session and perform AI operation
    await page.getByRole('textbox', { name: /what decision/i }).fill('Diagnostics Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(5000); // Wait for AI response

    // Check session data includes diagnostics
    const hasDiagnostics = await page.evaluate(() => {
      const data = localStorage.getItem('decision_session');
      if (!data) return false;
      const session = JSON.parse(data);
      return session.diagnostics !== undefined;
    });

    // Diagnostics should be present after AI calls
    // Note: This depends on AI service being available
    expect(hasDiagnostics).toBe(true);
  });

  test('should store conversation history in correct format', async ({ page }) => {
    await page.goto('/');

    // Start conversation
    await page.getByRole('textbox', { name: /what decision/i }).fill('Conversation Format Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(3000);

    // Check conversation structure
    const conversation = await page.evaluate(() => {
      const data = localStorage.getItem('decision_session');
      if (!data) return null;
      const session = JSON.parse(data);
      return session.conversation;
    });

    expect(conversation).toBeTruthy();
    expect(Array.isArray(conversation)).toBe(true);

    if (conversation && conversation.length > 0) {
      const firstMessage = conversation[0];
      expect(firstMessage).toHaveProperty('id');
      expect(firstMessage).toHaveProperty('role');
      expect(firstMessage).toHaveProperty('content');
      expect(firstMessage).toHaveProperty('timestamp');
    }
  });
});

test.describe('Auto-Save Functionality', () => {
  test('should auto-save session changes', async ({ page }) => {
    await page.goto('/');

    // Start session
    await page.getByRole('textbox', { name: /what decision/i }).fill('Auto-save Test');
    await page.getByRole('button', { name: /start/i }).click();

    await page.waitForTimeout(2000);

    // Make a change (send a message)
    const chatInput = page.getByRole('textbox', { name: /type your message/i });
    if (await chatInput.isVisible({ timeout: 2000 })) {
      await chatInput.fill('Test auto-save');
      await page.getByRole('button', { name: /send/i }).click();

      // Wait for debounced auto-save (1 second + buffer)
      await page.waitForTimeout(1500);

      // Check that localStorage was updated
      const savedMessage = await page.evaluate(() => {
        const data = localStorage.getItem('decision_session');
        return data ? data.includes('Test auto-save') : false;
      });

      expect(savedMessage).toBe(true);
    }
  });

  test('should debounce rapid changes', async ({ page }) => {
    // Test that auto-save doesn't fire on every keystroke
    // Should wait for user to stop typing

    test.skip('Requires monitoring localStorage write frequency');
  });
});

test.describe('Export Data Format', () => {
  test('should export session in Scenario Sandbox format', async ({ page }) => {
    // After completing pre-mortem:
    // 1. Export data
    // 2. Verify format matches ScenarioSandboxInput interface
    // 3. Check all required fields are present

    test.skip('Requires export functionality implementation');
  });

  test('should include all failure scenarios in export', async ({ page }) => {
    // Verify:
    // 1. All generated scenarios are included
    // 2. Root causes are mapped correctly
    // 3. Mitigations are linked to scenarios

    test.skip('Requires generated scenarios and export');
  });
});
