# End-to-End Testing Suite

Comprehensive E2E tests for the Pre-Mortem Analysis Tool using Playwright.

## Test Coverage

### 1. Conversational Flow (`conversational-flow.spec.ts`)
Tests the new conversational interface for pre-mortem analysis:
- ✅ Welcome screen display
- ✅ Session initialization
- ⏳ AI conversation (requires AI service)
- ✅ Message persistence
- ⏳ Context extraction (requires AI service)
- ✅ Chat panel toggling

**Status**: Core UI tests pass; AI-dependent tests require API mocking or live service

### 2. Data Persistence (`data-persistence.spec.ts`)
Tests session storage, data integrity, and schema conformance:
- ✅ localStorage save/restore
- ✅ Session data validation
- ✅ Corrupted data handling
- ⏳ Schema v1 conformance (requires full session)
- ✅ Auto-save functionality
- ⏳ Export format validation (requires P2 completion)

**Status**: Core persistence tests pass; full schema tests require complete sessions

### 3. Diagnostics & Telemetry (`diagnostics-and-telemetry.spec.ts`)
Tests P1.2 and P1.3 features:
- ✅ Diagnostics overlay visibility
- ⏳ Diagnostics data population (requires AI calls with diagnostics)
- ✅ Degraded banner absence in normal operation
- ⏳ Degraded mode triggering (requires API failure mocking)
- ⏳ Telemetry privacy verification (requires MSW setup)

**Status**: UI component tests pass; integration tests require MSW for API mocking

### 4. Accessibility (`accessibility.spec.ts`)
Tests WCAG AA compliance and UX:
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ⏳ Screen reader experience (requires axe-core)
- ✅ Responsive design
- ✅ Loading states

**Status**: Core accessibility tests pass; screen reader tests require specialized tools

### 5. Legacy Workflow (`premortem-workflow.spec.ts`)
Tests from previous implementation:
- ⚠️ **Deprecated**: Tests old wizard-style UI
- 📝 **Action Required**: Update to match new conversational flow

**Status**: Needs refactoring to align with conversational interface

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Specific Test File
```bash
npx playwright test e2e/conversational-flow.spec.ts
```

### Interactive Mode
```bash
npx playwright test --ui
```

### Debug Mode
```bash
npx playwright test --debug
```

## Test Requirements

### 1. Development Server
Tests automatically start the dev server (`npm run dev`) via Playwright's `webServer` configuration.

### 2. AI Service (Optional)
For full AI-dependent tests, ensure:
- Anthropic API key in `.env`: `ANTHROPIC_API_KEY=sk-...`
- OR OpenAI API key: `OPENAI_API_KEY=sk-...`

Without API keys, AI-dependent tests will be skipped.

### 3. API Mocking (Recommended)
For consistent test results, use MSW (Mock Service Worker):

```typescript
// e2e/mocks/handlers.ts
export const handlers = [
  rest.post('/api/chat', (req, res, ctx) => {
    return res(
      ctx.json({
        role: 'assistant',
        content: 'Mock AI response',
      })
    );
  }),
];
```

## Test Patterns

### 1. Session Initialization
```typescript
test('should start session', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());

  const question = page.locator('#question');
  await question.fill('Test decision');
  await page.getByRole('button', { name: /start pre-mortem/i }).click();

  await expect(page.getByText(/Test decision/i)).toBeVisible();
});
```

### 2. Waiting for AI Responses
```typescript
// Wait for AI response with timeout
await expect(page.getByText(/olumi/i)).toBeVisible({ timeout: 15000 });

// Or wait for typing indicator to disappear
await expect(page.getByTestId('typing-indicator')).not.toBeVisible({ timeout: 15000 });
```

### 3. Checking localStorage
```typescript
const sessionData = await page.evaluate(() => {
  return localStorage.getItem('decision_session');
});

expect(sessionData).toBeTruthy();
const session = JSON.parse(sessionData!);
expect(session).toHaveProperty('id');
```

### 4. Simulating Degraded Mode
```typescript
await page.evaluate(() => {
  const session = JSON.parse(localStorage.getItem('decision_session') || '{}');
  session.diagnostics = {
    apiCalls: [{
      step: 'scenario_generation',
      status: 'error',
      errorMessage: 'Timeout',
    }],
    degraded: true,
    degradedReason: 'AI service unavailable',
  };
  localStorage.setItem('decision_session', JSON.stringify(session));
});
await page.reload();
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Test Retries
In CI, tests automatically retry up to 2 times on failure (configured in `playwright.config.ts`).

## Debugging Failed Tests

### 1. View Traces
```bash
npx playwright show-report
```

### 2. Run in Headed Mode
```bash
npx playwright test --headed
```

### 3. Step Through Test
```bash
npx playwright test --debug
```

### 4. Screenshot on Failure
Screenshots are automatically saved to `test-results/` when tests fail.

## Test Data

### Golden Fixtures
Located in `fixtures/premortem/`:
- `decision-complete.v1.json` - Complete pre-mortem session
- `decision-minimal.v1.json` - Minimal valid session

Used for testing schema validation and data integrity.

## Known Limitations

1. **AI Service Dependency**: Tests that interact with real AI services can be flaky due to network conditions and API rate limits.
   - **Solution**: Use MSW to mock AI responses for consistent results.

2. **Timing-Sensitive Tests**: Some tests use `waitForTimeout()` which can be flaky.
   - **Solution**: Replace with explicit waits for specific elements/states.

3. **Browser Differences**: Some features may behave differently across browsers.
   - **Solution**: Test on all three engines (Chromium, Firefox, WebKit).

## Future Enhancements

- [ ] Integrate MSW for API mocking
- [ ] Add visual regression testing with Percy or Chromatic
- [ ] Add performance monitoring with Lighthouse
- [ ] Add axe-core for automated accessibility testing
- [ ] Add E2E tests for P2-P6 features as they're implemented
- [ ] Set up continuous E2E testing in CI/CD pipeline

## Contributing

When adding new features:
1. Write E2E tests first (TDD approach)
2. Use semantic selectors (roles, labels) over CSS selectors
3. Test both happy paths and error scenarios
4. Ensure tests pass on all browsers
5. Add tests to appropriate test file based on feature area

## Questions?

See Playwright documentation: https://playwright.dev/
