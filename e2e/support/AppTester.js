import { expect } from '@playwright/test';
import { PageObject } from './PageObject';
import { ActionButtonsTester } from './testers/ActionButtonsTester';
import { PrintableDocumentTester } from './testers/PrintableDocumentTester';
import { SettingsTester } from './testers/SettingsTester';
export class AppTester extends PageObject {
    constructor(page) {
        super({ page });
    }
    // Component testers
    get actionButtons() {
        return new ActionButtonsTester(this.context);
    }
    get printableDocument() {
        return new PrintableDocumentTester(this.context);
    }
    get settings() {
        return new SettingsTester(this.context);
    }
    // App-wide locators
    get app() {
        return this.page.locator('.app');
    }
    get loading() {
        return this.page.locator('.app__loading');
    }
    get error() {
        return this.page.locator('.app__error');
    }
    get content() {
        return this.page.locator('.app__content');
    }
    get noData() {
        return this.page.locator('.app__no-data');
    }
    get signedDocument() {
        return this.page.locator('.app__signed');
    }
    // Core app actions
    async goto() {
        await this.page.goto('/');
        // Wait for the default TEST-001 document to load
        await this.printableDocument.waitForDocumentNumber('TEST-001');
    }
    async reload() {
        await this.page.reload();
    }
    async waitForAppLoad() {
        await expect(this.app).toBeVisible();
    }
    async waitForContent() {
        await expect(this.content).toBeVisible();
    }
    async waitForLoading() {
        await expect(this.loading).toBeVisible();
    }
    // Generic helpers
    async expectTextVisible(text) {
        await expect(this.page.locator(`text=${text}`)).toBeVisible();
    }
    async waitFor(selector) {
        await this.page.locator(selector).waitFor();
    }
    // Viewport helpers
    async setViewport(width, height) {
        await this.page.setViewportSize({ width, height });
    }
    // Screenshot helpers
    async hideUIElementsForScreenshot() {
        await this.page.addStyleTag({
            content: `
        .action-buttons { display: none !important; }
        .app__settings { display: none !important; }
      `
        });
    }
    async takeScreenshot(filename) {
        await this.page.screenshot({
            path: `e2e-results/${filename}`,
            fullPage: true
        });
    }
    async takeDocumentScreenshot(filename) {
        // Screenshot either the document or signed document element
        const documentSelector = this.page.locator('.document, .app__signed').first();
        await documentSelector.screenshot({
            path: `e2e-results/${filename}`
        });
    }
    // Scenario helpers
    async getAllScenarios() {
        await this.waitForContent();
        // Get all scenario options from the select element
        return await this.actionButtons.scenarioSelector.locator('option').evaluateAll((options) => options
            .filter(opt => opt.value) // Skip empty option
            .map(opt => ({
            slug: opt.value,
            title: opt.textContent || opt.value
        })));
    }
    // Mock data helpers
    async dispatchMockRecord(data) {
        await this.page.evaluate((recordData) => {
            document.dispatchEvent(new CustomEvent('mockgristrecord', {
                detail: recordData
            }));
        }, data);
        // Wait for the document to fully load with the correct data
        if (data?.Record?.Number) {
            await this.printableDocument.waitForDocumentNumber(data.Record.Number);
        }
    }
    async dispatchInvalidData() {
        await this.page.evaluate(() => {
            document.dispatchEvent(new CustomEvent('mockgristrecord', {
                detail: { invalid: 'data' }
            }));
        });
    }
    // State assertions
    async expectErrorState() {
        await expect(this.error).toBeVisible();
        await expect(this.page.locator('text=เกิดข้อผิดพลาด')).toBeVisible();
        await expect(this.page.locator('text=ข้อมูลไม่ถูกต้อง')).toBeVisible();
    }
    async expectSignedDocumentState() {
        await expect(this.signedDocument).toBeVisible();
        await expect(this.page.locator('text=เอกสารนี้ได้ถูกลงชื่อเรียบร้อยแล้ว')).toBeVisible();
    }
    // Session storage helpers
    async getSessionStorageItem(key) {
        return await this.page.evaluate((storageKey) => {
            return sessionStorage.getItem(storageKey);
        }, key);
    }
}
