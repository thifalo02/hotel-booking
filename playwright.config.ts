import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENV = (process.env.ENV || process.env.ENVIRONMENT || process.env.NODE_ENV || '').toUpperCase();
const envBaseURLs = {
  DEV: process.env.BASE_URL_DEV ?? 'https://dev.simplenight.com',
  HML: process.env.BASE_URL_HML ?? 'https://hml.simplenight.com',
  PROD: process.env.BASE_URL_PROD ?? 'https://app.simplenight.com',
} as const;
const resolvedBaseURL = ENV && (ENV in envBaseURLs)
  ? envBaseURLs[ENV as keyof typeof envBaseURLs]
  : (process.env.BASE_URL ?? 'https://app.simplenight.com');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // No time limit per test
  timeout: 120_000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: resolvedBaseURL,
    // No action/navigation timeouts
    actionTimeout: 0,
    navigationTimeout: 0,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    headless: !!process.env.CI
  },
  // No timeout for expect
  expect: { timeout: 0 },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
