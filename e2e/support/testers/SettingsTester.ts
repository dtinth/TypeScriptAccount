import { expect } from '@playwright/test'
import { PageObject } from '../PageObject'

export class SettingsTester extends PageObject {
  // Locators - Using semantic locators instead of CSS selectors
  get toggle() {
    return this.page.getByTestId('settings-toggle')
  }

  get content() {
    return this.page.getByTestId('settings-content')
  }

  get customCssTextarea() {
    return this.page.getByTestId('custom-css-textarea')
  }

  get applyButton() {
    return this.page.getByTestId('apply-settings-button')
  }

  get container() {
    return this.page.getByTestId('settings-panel')
  }

  // Actions
  async open() {
    await this.toggle.click()
    await expect(this.content).toBeVisible()
  }

  async setCustomCSS(css: string) {
    await this.customCssTextarea.fill(css)
  }

  async apply() {
    await this.applyButton.click()
  }

  // Assertions
  async expectCustomCSSValue(expectedCss: string) {
    await expect(this.customCssTextarea).toHaveValue(expectedCss)
  }

  async expectContentVisible() {
    await expect(this.content).toBeVisible()
  }
}