# Playwright E2E Tests (POM)

End-to-end tests using Playwright with Page Object Model (POM).

## Quick Start

- Install dependencies and browsers

```bash
npm install
npx playwright install
```

// Or use the setup script (detects browsers and installs only if needed)

```bash
npm run setup
```

- Run tests

```bash
# All tests
npx playwright test

# UI mode (interactive)
npx playwright test --ui

# Only the Home interaction
npx playwright test --grep "Home - basic interaction"
```

- Reports

```bash
npx playwright show-report
```

## Requirements

- Node.js 18+ and npm
- macOS, Linux or Windows with Chromium installed by Playwright
- Internet access (tests use baseURL: https://app.simplenight.com)

## Continuous Integration (CI)

- GitHub Actions workflow runs Playwright tests headless on `ubuntu-latest`.
- See [.github/workflows/ci.yml](.github/workflows/ci.yml).
- Headless mode is enabled when `CI` is set; see [playwright.config.ts](playwright.config.ts#L33-L36).

Artifacts
- Playwright HTML report is uploaded as an artifact for each run.

## Environments

- Configure base URL via environment name `ENV` (DEV/HML/PROD).
- Define URLs per environment in `.env` (see [.env.example](.env.example)).

Examples
```bash
# Using npm scripts
npm run test:dev    # ENV=DEV -> BASE_URL_DEV
npm run test:hml    # ENV=HML -> BASE_URL_HML
npm run test:prod   # ENV=PROD -> BASE_URL_PROD

# Or inline (macOS/Linux)
ENV=DEV npx playwright test
ENV=HML npx playwright test
ENV=PROD npx playwright test
```

The config maps `ENV` to `BASE_URL_DEV/HML/PROD` (see [playwright.config.ts](playwright.config.ts)).

## Structure

- src/pages/
  - BasePage.ts: base class with common helpers.
  - HomePage.ts: example page (playwright.dev).
- tests/
  - fixtures/test-base.ts: fixture that injects pages into tests.
  - example.spec.ts: spec rewritten to use POM.
- playwright.config.ts: Playwright configuration (includes `baseURL`).
- tsconfig.json: TypeScript configuration for the project.
- docs/templates/: templates for new utils/fixtures/pages with standardized comments.

## Commands

```bash
# Install Playwright browsers
npm run install:deps

# Run all tests
npm test

# UI runner (useful during development)
npm run test:ui

# Open the latest report
npm run show-report
```

## Project Mindmap

```
tests/
  fixtures/
    test-base.ts
  home.interaction.spec.ts
src/
  pages/
    BasePage.ts
    HomePage.ts
  selectors/
    home.ts
  helpers/
    Utils.ts
playwright.config.ts
package.json
tsconfig.json
README.md
docs/
  templates/
    util-template.ts
    fixture-template.ts
    page-template.ts
playwright-report/
  index.html
test-results/
```

---

Author: Thiago Maciel