import { Page } from '@playwright/test';
import { BasePage } from '../../src/pages/BasePage';

/**
 * PageTemplate encapsulates interactions for <Page Name>.
 * Describe the main flows and responsibilities briefly.
 */
export class PageTemplate extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates and waits for a stable state.
   */
  async open() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }
}
