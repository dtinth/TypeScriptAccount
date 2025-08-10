import { expect } from '@playwright/test';
import { PageObject } from '../PageObject';
export class ActionButtonsTester extends PageObject {
    // Locators
    get container() {
        return this.page.locator('.action-buttons');
    }
    get scenarioSelector() {
        return this.page.locator('#scenario-select');
    }
    get scenarioSelectorContainer() {
        return this.page.locator('.action-buttons__scenario');
    }
    get printButton() {
        return this.page.locator('.action-buttons__button--primary');
    }
    get copyJsonButton() {
        return this.page.locator('.action-buttons__button--secondary');
    }
    // Actions
    async selectScenario(slug) {
        // Wait for the selector to be visible and enabled
        await expect(this.scenarioSelector).toBeVisible();
        await expect(this.scenarioSelector).toBeEnabled();
        await this.scenarioSelector.selectOption(slug);
        // Wait for the content to update after scenario selection
        // Different scenarios may show different states (document vs signed)
        await this.page.waitForTimeout(500); // Small delay to let the scenario change
    }
    async clickPrint() {
        await this.printButton.click();
    }
    async clickCopyJson() {
        await this.copyJsonButton.click();
    }
    // Mock helpers
    async mockClipboardAPI() {
        await this.page.evaluate(() => {
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: async (text) => {
                        ;
                        window.clipboardText = text;
                    }
                }
            });
        });
    }
    async getClipboardText() {
        return await this.page.evaluate(() => window.clipboardText);
    }
    // Assertions
    async expectVisible() {
        await expect(this.container).toBeVisible();
    }
    async expectScenarioSelectorVisible() {
        await expect(this.scenarioSelectorContainer).toBeVisible();
        await expect(this.scenarioSelector).toBeVisible();
    }
    async expectPrintButtonDisabled() {
        await expect(this.printButton).toBeDisabled();
    }
}
