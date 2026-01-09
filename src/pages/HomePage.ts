import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HOME_SELECTORS } from '../selectors/home';
import { Utils } from '../helpers/Utils';

/**
 * HomePage encapsulates user interactions with the Home screen.
 * It provides robust flows for search form completion, result filtering,
 * and map interactions, centralizing all selectors via HOME_SELECTORS.
 */
export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigates to the Home page and waits for initial load to stabilize.
     * Ensures both DOM and network are idle before proceeding.
     */
    async open() {
        await this.page.goto('/');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fills the destination field using the editable input.
     * If a secondary option is provided, selects it from suggestions; otherwise confirms with Enter.
     * @param primary Main destination text to type.
     * @param secondary Optional suggestion text to click (regex matched, case-insensitive).
     */
    async setGoingTo(primary: string, secondary?: string) {
        // Use only the strongest locator: trigger + editable input
        await this.goingToTrigger().click({ force: true }).catch(() => { });
        const input = this.page.locator(HOME_SELECTORS.searchForm.location.input.editable).first();
        await input.fill(primary).catch(() => { });
        if (secondary) {
            const option = this.page.getByRole('option', { name: new RegExp(secondary, 'i') }).first();
            await option.click().catch(async () => { await input.press('Enter'); });
        } else {
            await input.press('Enter');
        }
    }

    /**
     * Opens the date picker and selects a start and end date.
     * Switches the year and month, then confirms via the Done button.
     * @param startDate Day number for start (e.g., "20").
     * @param endDate Day number for end (e.g., "22").
     * @param month Month name displayed by the UI (e.g., "May").
     * @param year Year displayed by the UI (e.g., "2026").
     */
    async fillDates(startDate: string, endDate: string, month: string, year: string) {
        await this.datesTrigger().click();
        await this.page.getByRole('button', { name: year }).first().click().catch(() => { });
        await this.page.getByRole('button', { name: month }).first().click().catch(() => { });
        await this.page.getByRole('button', { name: `${startDate} ${month}` }).first().click()
        await this.page.getByRole('button', { name: `${startDate} ${month}` }).first().click().catch(() => { });
        await this.page.getByRole('button', { name: `${endDate} ${month}` }).first().click().catch(() => { });
        await this.page.getByTestId(HOME_SELECTORS.searchForm.dates.doneButton).first().click().catch(() => { });
    }

    /**
     * Opens the travelers panel, adds children, and sets the first child's age.
     * Uses accessible labels from selectors to remain resilient.
     * @param childCount Number of children to add.
     * @param firstChildAge Optional age for the first child (defaults to 6).
     */
    async setTravelers(childCount: number, firstChildAge: number = 6) {
        await this.page.getByTestId(HOME_SELECTORS.searchForm.travelers.trigger).first().click();
        for (let i = 0; i < childCount; i++) {
            await this.page.getByRole('button', { name: HOME_SELECTORS.searchForm.travelers.addChildButtonLabel }).click();
        }
        await this.page.getByRole('textbox', { name: HOME_SELECTORS.searchForm.travelers.child1AgeTextboxLabel }).click();
        const agePattern = new RegExp(`^${firstChildAge}$`);
        await this.page.locator('div').filter({ hasText: agePattern }).nth(1).click();
    }

    /**
     * Submits the search form to navigate to search results.
     */
    async goToResults() {
        await this.page.getByTestId(HOME_SELECTORS.searchForm.submit.searchButton).click();
    }

    /**
     * Filters results by price range and rating, then switches to Map view.
     * Ensures filters are visible and map container is ready before interactions.
     * @param minPrice Minimum price boundary for the slider.
     * @param maxPrice Maximum price boundary for the slider.
     */
    async filterResults(minPrice: number, maxPrice: number) {
        await this.switchToMapView();
        await this.setPriceRange(minPrice, maxPrice);
        await this.applyRatingVeryGoodFilter();
    }

    /**
     * Switches the results layout to Map view and waits until the map is visible.
     */
    async switchToMapView() {
        const layoutTrigger = this.page.locator(HOME_SELECTORS.results.layout.layoutSelectTrigger).first();
        await layoutTrigger.click({ force: true }).catch(() => { });
        const mapByText = this.page.getByText(HOME_SELECTORS.results.layout.mapOptionText, { exact: true }).first();
        if (await mapByText.isVisible().catch(() => false)) {
            await mapByText.click({ force: true });
        } else {
            const mapByRole = this.page.getByRole('option', { name: /map/i }).first();
            if (await mapByRole.isVisible().catch(() => false)) {
                await mapByRole.click({ force: true });
            }
        }
        await this.page.locator(HOME_SELECTORS.results.map.root).first().waitFor({ state: 'visible' });
    }

    /**
     * Sets the price range using the slider, waiting until the slider is visible first.
     * @param minPrice Minimum price boundary
     * @param maxPrice Maximum price boundary
     */
    async setPriceRange(minPrice: number, maxPrice: number) {
        const sliderRoot = this.page.getByTestId(HOME_SELECTORS.results.filters.priceSliderRoot);
        await sliderRoot.first().waitFor({ state: 'visible' });
        await Utils.setSliderRange(this.page, sliderRoot, minPrice, maxPrice);
    }

    /**
     * Applies the "Very Good (7+)" rating filter.
     */
    async applyRatingVeryGoodFilter() {
        await this.page.getByLabel(HOME_SELECTORS.results.filters.ratingVeryGoodLabel).check();
    }

    /**
     * Interacts with the map, zooms in, and clicks the first visible pin.
     * Waits for any loading indicators to disappear before interacting.
     */
    async selectPinMap() {
        // Wait until the map container is visible
        const mapRoot = this.page.locator(HOME_SELECTORS.results.map.root).first();
        await mapRoot.waitFor({ state: 'visible' });

        // Wait for the results loader to disappear (progress bar)
        const loadingSelector = `${HOME_SELECTORS.results.loading.loadingBarRoot}, ${HOME_SELECTORS.results.loading.loadingBarSection}`;
        await this.page.waitForFunction((sel) => !document.querySelector(sel), loadingSelector, { timeout: 120_000 });

        // Focus the map center with a simple click
        const box = await mapRoot.boundingBox();
        if (!box) return;
        await mapRoot.click({ position: { x: box.width / 2, y: box.height / 2 } });
        for (let i = 0; i < 2; i++) {
            await this.page.keyboard.press('+');
        }

        // After zooming, wait for at least one pin and click the first visible
        const pins = this.page.locator(HOME_SELECTORS.results.map.pin);
        try {
            const pinSelector = HOME_SELECTORS.results.map.pin;
            await this.page.waitForFunction((sel) => (document.querySelectorAll(sel).length ?? 0) > 0, pinSelector, { timeout: 30_000 });

            const count = await pins.count();
            for (let i = 0; i < Math.min(count, 5); i++) {
                const pin = pins.nth(i);
                if (await pin.isVisible().catch(() => false)) {
                    await pin.click({ force: true });
                    break;
                }
            }
        } catch {
            // In canvas-only maps, there are no clickable pin elements in the DOM
        }
    }

    /**
     * Extracts rating and total price from the map or result card.
     * Falls back to article sections that include taxes text when necessary.
     * @returns Object with `rateText`, `rate`, `totalText`, and parsed `totalValue`.
     */
    async getCartRateAndTotal() {
        const candidates = [
            this.page.locator(HOME_SELECTORS.results.map.card).first(),
            this.page.locator('article').filter({ hasText: HOME_SELECTORS.results.display.includesTaxesFeesText }).first(),
        ];
        const root = (await Utils.waitForAnyVisible(candidates)) ?? candidates[0];

        const rateEl = root.locator(HOME_SELECTORS.results.display.ratingBadgeSelector).first();
        await rateEl.waitFor({ state: 'visible' });
        await rateEl.scrollIntoViewIfNeeded().catch(() => { });
        const rateText = ((await rateEl.textContent()) ?? '').trim();
        const rate = parseFloat(rateText.replace(',', '.'));

        const currencyPattern = /(?:US\$|R\$|\$|€|£)\s?\d[0-9.,]*/;
        const totalEl = root.getByText(currencyPattern, { exact: false }).first();
        await totalEl.waitFor({ state: 'visible' });
        await totalEl.scrollIntoViewIfNeeded().catch(() => { });
        const totalText = ((await totalEl.textContent()) ?? '').trim();
        const totalValue = Number(
            totalText
                .replace(/[^0-9.,]/g, '')
                .replace(/\.(?=\d{3}(\D|$))/g, '')
                .replace(/,(?=\d{2}$)/, '.')
                .replace(/(?<=\d)\.(?=\d{2}$)/, '.')
        );

        return { rateText, rate, totalText, totalValue };
    }

    /**
     * Captures a screenshot of the current page.
     * @param fullPage When true, captures the full scrollable page.
     * @returns Buffer containing PNG image data.
     */
    async captureScreenshot(fullPage: boolean = true): Promise<Buffer> {
        return await this.page.screenshot({ fullPage });
    }

    /**
     * Returns the destination trigger element.
     * Kept private to encapsulate locator stability.
     */
    private goingToTrigger() {
        return this.page.locator(HOME_SELECTORS.searchForm.location.trigger).first();
    }

    /**
     * Returns the dates trigger element.
     * Kept private to encapsulate locator stability.
     */
    private datesTrigger() {
        return this.page.locator(HOME_SELECTORS.searchForm.dates.trigger).first();
    }
}
