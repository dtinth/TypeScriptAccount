import { expect } from '@playwright/test'
import type { GristRecord } from '../../../src/types/document-schema'
import { PageObject } from '../PageObject'

export class GristWidgetPage extends PageObject {
  // Locators
  get app() {
    return this.page.locator('.app')
  }

  get loading() {
    return this.page.locator('.app__loading')
  }

  get error() {
    return this.page.locator('.app__error')
  }

  get content() {
    return this.page.locator('.app__content')
  }

  get noData() {
    return this.page.locator('.app__no-data')
  }

  get signedDocument() {
    return this.page.locator('.app__signed')
  }

  get actionButtons() {
    return this.page.locator('.action-buttons')
  }

  get scenarioSelector() {
    return this.page.locator('#scenario-select')
  }

  get scenarioSelectorContainer() {
    return this.page.locator('.action-buttons__scenario')
  }

  get printButton() {
    return this.page.locator('.action-buttons__button--primary')
  }

  get copyJsonButton() {
    return this.page.locator('.action-buttons__button--secondary')
  }

  get settingsToggle() {
    return this.page.locator('.app__settings-toggle')
  }

  get settingsContent() {
    return this.page.locator('.app__settings-content')
  }

  get customCssTextarea() {
    return this.page.locator('#custom-css')
  }

  get applyCssButton() {
    return this.page.locator('.app__settings-apply')
  }

  // Actions
  async goto() {
    await this.page.goto('/')
  }

  async waitForAppLoad() {
    await expect(this.app).toBeVisible()
  }

  async waitForContent() {
    await expect(this.content).toBeVisible()
  }

  async waitForLoading() {
    await expect(this.loading).toBeVisible()
  }

  async selectScenario(slug: string) {
    await this.scenarioSelector.selectOption(slug)
  }

  async dispatchMockRecord(data: GristRecord) {
    await this.page.evaluate((recordData) => {
      document.dispatchEvent(new CustomEvent('mockgristrecord', {
        detail: recordData
      }))
    }, data)
  }

  async dispatchInvalidData() {
    await this.page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('mockgristrecord', {
        detail: { invalid: 'data' }
      }))
    })
  }

  async openSettings() {
    await this.settingsToggle.click()
    await expect(this.settingsContent).toBeVisible()
  }

  async setCustomCSS(css: string) {
    await this.customCssTextarea.fill(css)
  }

  async applyCustomCSS() {
    await this.applyCssButton.click()
  }

  async mockClipboardAPI() {
    await this.page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            ;(window as { clipboardText?: string }).clipboardText = text
          }
        }
      })
    })
  }

  async getClipboardText() {
    return await this.page.evaluate(() =>
      (window as { clipboardText?: string }).clipboardText
    )
  }

  async getSessionStorageItem(key: string) {
    return await this.page.evaluate((storageKey) => {
      return sessionStorage.getItem(storageKey)
    }, key)
  }

  // Assertions
  async expectScenarioSelectorVisible() {
    await expect(this.scenarioSelectorContainer).toBeVisible()
    await expect(this.scenarioSelector).toBeVisible()
  }

  async expectDocumentNumber(number: string) {
    await expect(this.page.locator(`text=${number}`)).toBeVisible()
  }

  async expectClientName(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible()
  }

  async expectErrorState() {
    await expect(this.error).toBeVisible()
    await expect(this.page.locator('text=เกิดข้อผิดพลาด')).toBeVisible()
    await expect(this.page.locator('text=ข้อมูลไม่ถูกต้อง')).toBeVisible()
  }

  async expectSignedDocumentState() {
    await expect(this.signedDocument).toBeVisible()
    await expect(this.page.locator('text=เอกสารนี้ได้ถูกลงชื่อเรียบร้อยแล้ว')).toBeVisible()
  }

  async expectPrintButtonDisabled() {
    await expect(this.printButton).toBeDisabled()
  }

  async expectCustomCSSValue(expectedCss: string) {
    await expect(this.customCssTextarea).toHaveValue(expectedCss)
  }

  async expectActionButtonsVisible() {
    await expect(this.actionButtons).toBeVisible()
  }

  // Viewport helpers
  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height })
  }

  // Screenshot helpers
  async hideUIElementsForScreenshot() {
    await this.page.addStyleTag({
      content: `
        .action-buttons { display: none !important; }
        .app__settings { display: none !important; }
      `
    })
  }

  async takeScreenshot(filename: string) {
    await this.page.screenshot({
      path: `e2e-results/${filename}`,
      fullPage: true
    })
  }

  // Navigation helpers
  async reload() {
    await this.page.reload()
  }

  // Text content helpers
  async expectTextVisible(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible()
  }

  // Wait helpers
  async waitFor(selector: string) {
    await this.page.locator(selector).waitFor()
  }
}