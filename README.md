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
npx playwright test --grep "Home - interação básica"
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

## Estrutura

- src/pages/
  - BasePage.ts: classe base com helpers comuns.
  - HomePage.ts: exemplo de página (playwright.dev).
- tests/
  - fixtures/test-base.ts: fixture que injeta as páginas nos testes.
  - example.spec.ts: spec reescrita para usar POM.
- playwright.config.ts: configuração do Playwright (inclui `baseURL`).
- tsconfig.json: configurações TypeScript para o projeto.
- docs/templates/: modelos para novos utils/fixtures/pages com comentários padronizados.

## Comandos

```bash
# Instalar navegadores necessários do Playwright
npm run install:deps

# Rodar todos os testes
npm test

# UI runner (útil durante o desenvolvimento)
npm run test:ui

# Abrir o último relatório
npm run show-report
```

## Padrões de Projeto

- Crie uma classe por página em `src/pages`.
- Coloque ações e asserts específicos da página dentro do Page Object.
- Use fixtures em `tests/fixtures` para injetar page objects tipados nos testes.
- Evite duplicar seletores nos testes – centralize nos Page Objects.

## Doc Comments Guidelines (English)

- Purpose: Add clear, concise JSDoc comments to new utilities, fixtures, and pages.
- Tone: Objective, one or two sentences describing intent and behavior.
- Where:
  - Pages: Class summary; each public method with params and side effects.
  - Utils: Class summary; each helper method with input/output.
  - Fixtures: Brief explanation of provided fixtures and their purpose.
- Examples:

```ts
/**
 * HomePage encapsulates interactions with the Home screen.
 * Provides flows for search form completion and result filtering.
 */
export class HomePage extends BasePage {
  /**
   * Navigates to Home and waits for stable load states.
   */
  async open() { /* ... */ }

  /**
   * Fills destination; selects a suggestion if provided.
   * @param primary Main destination text.
   * @param secondary Optional suggestion (regex matched).
   */
  async setGoingTo(primary: string, secondary?: string) { /* ... */ }
}
```

```ts
/**
 * Utils centralizes resilient UI helpers.
 */
export class Utils {
  /** Returns first visible locator or null. */
  static async waitForAnyVisible(locators: Locator[]) { /* ... */ }
}
```

```ts
/**
 * Extends Playwright's test with project fixtures.
 * Provides a `homePage` fixture to simplify interactions across specs.
 */
export const test = base.extend<Fixtures>({ /* ... */ });
```

## Templates

- See `docs/templates` for starter files to keep comments consistent.

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

Assinado por: Thiago Maciel