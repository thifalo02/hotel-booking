import { test as base } from '@playwright/test';

type Fixtures = {
  // Add your typed fixtures here
};

/**
 * Extends Playwright's test with project fixtures.
 * Document each fixture to clarify responsibility and usage.
 */
export const test = base.extend<Fixtures>({
  // myFixture: async ({ page }, use) => { /* ... */ },
});
