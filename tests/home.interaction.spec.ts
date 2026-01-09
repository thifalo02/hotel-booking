import { test, expect } from './fixtures/test-base';

test.describe('Home - basic interaction', () => {
    test('fill Going To, Dates and Travelers', async ({ homePage }) => {
        await homePage.open();

        const minRangePrice = 100;

        // Test steps
        await homePage.setGoingTo('Miami', 'Miami, FL, USA');
        await homePage.fillDates('20', '22', 'May', '2026');
        await homePage.setTravelers(1, 6);
        await homePage.goToResults();
        await homePage.switchToMapView();
        await homePage.setPriceRange(minRangePrice, 1000);
        await homePage.applyRatingVeryGoodFilter();
        await homePage.selectPinMap();
        const info = await homePage.getCartRateAndTotal();

        // Assertions
        expect(info.rateText).toBeTruthy();
        expect(info.totalText).toBeTruthy();
        expect(info.rate).toBeGreaterThanOrEqual(7);
        expect(info.rate).toBeLessThanOrEqual(10);
        expect(info.totalValue).toBeGreaterThan(minRangePrice);

        // Attach final screenshot to the report
        const image = await homePage.captureScreenshot(true);
        await test.info().attach('final-screenshot', { body: image, contentType: 'image/png' });

    });
});