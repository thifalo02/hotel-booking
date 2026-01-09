export const HOME_SELECTORS = {
    searchForm: {
        location: {
            trigger: '[data-testid*="search-form_location_trigger"]',
            input: {
                editable: 'input:not([readonly])',
            },
        },
        dates: {
            trigger: '[data-testid*="search-form_dates_trigger"]',
            doneButton: 'category(static_hotels)_search-form_dates_apply-button',
        },
        travelers: {
            trigger: 'category(static_hotels)_search-form_guests_trigger',
            addChildButtonLabel: 'Add Child',
            child1AgeTextboxLabel: 'Child 1 Age',
        },
        submit: {
            searchButton: 'category(static_hotels)_search-form_search-button',
        },
    },
    results: {
        filters: {
            priceSliderRoot: 'category(static_hotels)_search-results_price-filter_slider-root',
            ratingVeryGoodLabel: 'Very Good (7+)',
        },
        layout: {
            layoutSelectTrigger: '[data-testid*="search-results_layout-select_trigger"]',
            mapOptionText: 'Map',
        },
        loading: {
            // Loader de resultados (Mantine Progress)
            loadingBarRoot: '[class*="mantine-Progress-root" i]',
            loadingBarSection: '[role="progressbar"][class*="mantine-Progress-section" i]',
        },
        map: {
            root:
                '[data-testid*="search-results_map" i], [data-testid*="map-container" i], [data-testid*="map_root" i], [data-testid*="map" i], [id*="map" i], [class*="mapboxgl-map"], canvas.mapboxgl-canvas, canvas[aria-label*="map" i], [role="application"] canvas',
            pin:
                '[class*="mapboxgl-marker"], [data-testid*="map-pin"], [class*="map-pin"], [aria-label*="Marker" i], div.gm-style :not(a)[aria-label]:not([aria-label*="Open this area" i]):not([aria-label*="Terms" i]):not([aria-label*="Report" i]):not([aria-label*="Keyboard" i]):not([aria-label*="Map Data" i]):not([aria-label="Map"]):not([aria-label*="Zoom" i]):not([aria-label*="fullscreen" i]):not([aria-label*="street" i]):not([aria-label*="compass" i]):not([aria-label*="keyboard" i]):not(.gm-control-active):not([class*="gm-control"])',
            card:
                'div.gm-style .gm-style-iw, div.gm-style [role="dialog"], [data-testid*="map-card"], [class*="info-window"]',
        },
        display: {
            includesTaxesFeesText: 'Includes Taxes and Fees',
            ratingBadgeSelector: 'div.bg-success, [class*="bg-success"]',
        },
    },
};
