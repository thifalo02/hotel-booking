import { test as base, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

type Fixtures = {
  homePage: HomePage;
};

/**
 * Extends Playwright's `test` with project-specific fixtures.
 * Provides a `homePage` fixture to simplify Home page interactions across tests.
 */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
