import { test, expect } from '@playwright/test';
import { AppTester } from './support/AppTester';
test.describe('Visual Testing - Document Layouts', () => {
    test('generates screenshots for all scenarios', async ({ page }) => {
        const app = new AppTester(page);
        await app.goto();
        await app.waitForContent();
        // Ensure scenario selector is visible before proceeding
        await app.actionButtons.expectScenarioSelectorVisible();
        // Get all scenarios from the select element
        const scenarios = await app.getAllScenarios();
        for (const scenario of scenarios) {
            await test.step(`Screenshot: ${scenario.title}`, async () => {
                // Select the scenario
                await app.actionButtons.selectScenario(scenario.slug);
                // Take screenshot of just the document element
                await app.takeDocumentScreenshot(`${scenario.slug}.png`);
            });
        }
    });
    test('responsive design screenshots', async ({ page }) => {
        const app = new AppTester(page);
        const viewports = [
            { name: 'mobile', width: 375, height: 667 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'desktop', width: 1200, height: 800 }
        ];
        // Use first scenario for responsive testing
        const testScenarioSlug = 'receipt-vat-k8s-bug-hunt';
        for (const viewport of viewports) {
            await test.step(`Responsive ${viewport.name} - K8s Bug Hunt`, async () => {
                await app.setViewport(viewport.width, viewport.height);
                await app.goto();
                await app.waitForContent();
                await app.actionButtons.selectScenario(testScenarioSlug);
                // Take screenshot of just the document element
                await app.takeDocumentScreenshot(`${testScenarioSlug}-${viewport.name}.png`);
            });
        }
    });
    test('special states screenshots', async ({ page }) => {
        const app = new AppTester(page);
        await test.step('Loading state', async () => {
            await page.goto('/');
            // Try to catch the loading state quickly, but don't fail if we miss it
            try {
                await app.waitForLoading();
                await app.takeScreenshot('loading-state.png');
            }
            catch {
                // Loading was too fast to catch, take screenshot of loaded state instead
                await app.waitForContent();
                await app.takeScreenshot('loading-state.png');
            }
        });
        await test.step('Error state', async () => {
            await app.goto();
            await app.waitForAppLoad();
            await app.dispatchInvalidData();
            await expect(app.error).toBeVisible();
            await app.takeScreenshot('error-state.png');
        });
        await test.step('No data state', async () => {
            await app.goto();
            await app.waitForAppLoad();
            // Dispatch null to trigger no data state
            await page.evaluate(() => {
                document.dispatchEvent(new CustomEvent('mockgristrecord', {
                    detail: null
                }));
            });
            // Wait a moment for the state to process
            await app.app.waitFor();
            await app.takeScreenshot('no-data-state.png');
        });
        await test.step('Settings panel open', async () => {
            await app.goto();
            await app.waitForContent();
            // Open settings and add sample CSS
            await app.settings.open();
            await app.settings.setCustomCSS(`.document {
  --font-family: Comic Sans MS, Itim, sans-serif;
  --primary-color: #ff6b6b;
}`);
            await app.takeScreenshot('settings-panel.png');
        });
    });
    test('signed document state', async ({ page }) => {
        const app = new AppTester(page);
        await app.goto();
        await app.waitForContent();
        // Load signed document scenario
        await app.actionButtons.selectScenario('signed-demo');
        await expect(app.signedDocument).toBeVisible();
        await app.takeScreenshot('signed-document.png');
    });
});
