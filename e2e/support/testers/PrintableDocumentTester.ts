import { expect } from '@playwright/test'
import { PageObject } from '../PageObject'

export class PrintableDocumentTester extends PageObject {
  // Locators
  get document() {
    return this.page.locator('.document')
  }

  // Actions
  async waitForDocumentNumber(documentNumber: string) {
    await expect(this.document).toHaveAttribute('data-document-number', documentNumber)
  }

  // Assertions
  async expectDocumentNumber(number: string) {
    await expect(this.page.locator(`text=${number}`)).toBeVisible()
  }

  async expectClientName(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible()
  }

  async expectDocumentVisible() {
    await expect(this.document).toBeVisible()
  }
}