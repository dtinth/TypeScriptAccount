import { expect } from '@playwright/test'
import { PageObject } from '../PageObject'

export class SettingsTester extends PageObject {
  // Locators
  get toggle() {
    return this.page.locator('.app__settings-toggle')
  }

  get content() {
    return this.page.locator('.app__settings-content')
  }

  get customCssTextarea() {
    return this.page.locator('#custom-css')
  }

  get applyButton() {
    return this.page.locator('.app__settings-apply')
  }

  get container() {
    return this.page.locator('.app__settings')
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