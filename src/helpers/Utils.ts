import { expect, Locator, Page } from '@playwright/test';

/**
 * Utils centralizes robust UI interaction helpers.
 * It provides methods for waiting on any visible locator and
 * setting range sliders using only accessible keyboard interactions.
 */
export class Utils {
    /**
     * Returns the first locator that is currently visible.
     * Skips errors from detached/invalid locators to remain resilient.
     * @param locators List of candidate locators to check for visibility.
     * @returns The first visible locator, or `null` if none are visible.
     */
    static async waitForAnyVisible(locators: Locator[]) {
        for (const loc of locators) {
            try {
                if (await loc.isVisible()) return loc;
            } catch { }
        }
        return null;
    }

    /**
     * Adjusts a price range slider using keyboard arrows.
     * Works with one or two thumbs and respects `aria-valuemin/max/now`.
     * @param page Playwright `Page` used to send keyboard events.
     * @param root Root locator that contains the slider thumbs (role="slider").
     * @param minValue Optional target value for the minimum thumb.
     * @param maxValue Optional target value for the maximum thumb.
     */
    static async setSliderRange(page: Page, root: Locator, minValue?: number, maxValue?: number) {
        const thumbs = root.getByRole('slider');
        const count = await thumbs.count();
        const getNow = async (loc: Locator) => Number((await loc.getAttribute('aria-valuenow')) ?? NaN);
        const getMinAttr = async (loc: Locator) => Number((await loc.getAttribute('aria-valuemin')) ?? '0');
        const getMaxAttr = async (loc: Locator) => Number((await loc.getAttribute('aria-valuemax')) ?? '1000');

        let minThumb = thumbs.first();
        let maxThumb = count > 1 ? thumbs.nth(1) : undefined;

        if (count > 1) {
            const v0 = await getNow(thumbs.nth(0));
            const v1 = await getNow(thumbs.nth(1));
            if (v1 < v0) {
                minThumb = thumbs.nth(1);
                maxThumb = thumbs.nth(0);
            }
        }

        if (typeof minValue === 'number') {
            const minAttr = await getMinAttr(minThumb);
            const maxAttr = await getMaxAttr(minThumb);
            const targetMin = Math.max(minAttr, Math.min(maxAttr, minValue));
            await minThumb.evaluate((el: any) => el?.focus?.({ preventScroll: true }));
            // Adjust via keyboard without using End/Home to avoid any horizontal scroll
            for (let i = 0; i < 3000; i++) {
                const now = await getNow(minThumb);
                if (!Number.isFinite(now) || now === targetMin) break;
                await page.keyboard.press(now < targetMin ? 'ArrowRight' : 'ArrowLeft');
            }
        }

        if (maxThumb && typeof maxValue === 'number') {
            const minAttr = await getMinAttr(maxThumb);
            const maxAttr = await getMaxAttr(maxThumb);
            const targetMax = Math.max(minAttr, Math.min(maxAttr, maxValue));
            await maxThumb.evaluate((el: any) => el?.focus?.({ preventScroll: true }));
            for (let i = 0; i < 3000; i++) {
                const now = await getNow(maxThumb);
                if (!Number.isFinite(now) || now === targetMax) break;
                await page.keyboard.press(now < targetMax ? 'ArrowRight' : 'ArrowLeft');
            }
        }
    }
}
