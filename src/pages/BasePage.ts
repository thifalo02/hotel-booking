import { Page } from '@playwright/test';

/**
 * BasePage provides common functionality for all page objects.
 * It stores the Playwright `page` reference and exposes a simple `goto()` helper.
 */
export class BasePage {
  protected page: Page;

  /**
   * Constructs a page object bound to a Playwright `Page` instance.
   * @param page The Playwright `Page` used for interactions.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a given path relative to the configured `baseURL`.
   * @param path Path to navigate to (defaults to `/`).
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }
}
