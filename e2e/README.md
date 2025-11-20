# End-to-End Tests (E2E)

This directory will contain end-to-end tests for the Gyst application using Playwright.

## Setup Status

✅ Playwright is configured and ready to use
⏳ Test files will be written as features are implemented

## Planned Test Coverage

- Homepage loading and PWA features
- Authentication flow
- Task management (create, edit, complete tasks)
- Theme switching (Art Nouveau palettes)
- Dark mode toggle
- Cross-browser compatibility

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Single Browser
```bash
npm run test:e2e:chromium
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Structure

- **homepage.spec.ts** - Tests for homepage loading, PWA setup, and theme application
- **authentication.spec.ts** - Tests for user authentication flow
- **task-management.spec.ts** - Tests for task creation, editing, and management features

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

### Key Settings:
- **Base URL**: http://localhost:3000
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto-start dev server**: Yes (configured in webServer)
- **Screenshots**: Only on failure
- **Videos**: Retained on failure
- **Traces**: On first retry

## Writing New Tests

1. Create a new `.spec.ts` file in this directory
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Write your test suites:
   ```typescript
   test.describe('Feature Name', () => {
     test('should do something', async ({ page }) => {
       await page.goto('/');
       // Your test code
     });
   });
   ```

## Best Practices

1. **Use Data Attributes**: Add `data-testid` attributes to elements for reliable selectors
2. **Wait for Load State**: Always wait for `networkidle` or specific elements before assertions
3. **Flexible Selectors**: Use flexible selectors that work across theme changes
4. **Skip When Needed**: Use `test.skip()` for tests that depend on optional features
5. **Test PWA Features**: Verify offline functionality, manifest, and service worker
6. **Cross-browser**: Ensure tests work across all configured browsers

## Debugging

### Debug a Specific Test
```bash
npx playwright test --debug authentication.spec.ts
```

### Generate Test Code
```bash
npx playwright codegen http://localhost:3000
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

On CI, tests will:
- Run with 2 retries
- Use single worker for stability
- Skip flaky tests
- Generate HTML report

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
