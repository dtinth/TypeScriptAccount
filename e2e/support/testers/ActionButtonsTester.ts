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
    // Wait for the selector to be visible and enabled
    await expect(this.scenarioSelector).toBeVisible()
    await expect(this.scenarioSelector).toBeEnabled()
    
    await this.scenarioSelector.selectOption(slug)
    
    // Wait for the content to update after scenario selection
    // Different scenarios may show different states (document vs signed)
    await this.page.waitForTimeout(500) // Small delay to let the scenario change
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