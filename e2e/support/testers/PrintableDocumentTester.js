import { expect } from '@playwright/test';
import { PageObject } from '../PageObject';
export class PrintableDocumentTester extends PageObject {
    // Locators
    get document() {
        return this.page.locator('.document');
    }
    // Actions
    async waitForDocumentNumber(documentNumber) {
        await expect(this.document).toHaveAttribute('data-document-number', documentNumber);
    }
    // Assertions
    async expectDocumentNumber(number) {
        await expect(this.page.locator(`text=${number}`)).toBeVisible();
    }
    async expectClientName(name) {
        await expect(this.page.locator(`text=${name}`)).toBeVisible();
    }
    async expectDocumentVisible() {
        await expect(this.document).toBeVisible();
    }
}
