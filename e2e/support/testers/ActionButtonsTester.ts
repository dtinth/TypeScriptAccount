import { expect } from '@playwright/test'
import { PageObject } from '../PageObject'

export class ActionButtonsTester extends PageObject {
  // Locators - Using semantic locators instead of CSS selectors
  get container() {
    return this.page.getByTestId('action-buttons')
  }

  get scenarioSelector() {
    return this.page.getByTestId('scenario-selector')
  }

  get scenarioSelectorContainer() {
    return this.page.getByTestId('scenario-selector').locator('..')
  }

  get printButton() {
    return this.page.getByTestId('print-button')
  }

  get copyJsonButton() {
    return this.page.getByTestId('copy-json-button')
  }

  // Actions
  async selectScenario(slug: string) {
    const doc = this.page.locator('[data-document-number]').first()
    const docNumber = String(await doc.getAttribute('data-document-number'))
    await this.scenarioSelector.selectOption(slug)

    // Expect the document number to change
    await expect(doc).not.toHaveAttribute('data-document-number', docNumber)
  }

  async clickPrint() {
    await this.printButton.click()
  }

  async clickCopyJson() {
    await this.copyJsonButton.click()
  }

  // Mock helpers
  async mockClipboardAPI() {
    await this.page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            ;(window as { clipboardText?: string }).clipboardText = text
          },
        },
      })
    })
  }

  async getClipboardText() {
    return await this.page.evaluate(() => (window as { clipboardText?: string }).clipboardText)
  }

  // Assertions
  async expectVisible() {
    await expect(this.container).toBeVisible()
  }

  async expectScenarioSelectorVisible() {
    await expect(this.scenarioSelectorContainer).toBeVisible()
    await expect(this.scenarioSelector).toBeVisible()
  }

  async expectPrintButtonDisabled() {
    await expect(this.printButton).toBeDisabled()
  }
}
