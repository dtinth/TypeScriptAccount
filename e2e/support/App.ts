import type { Page } from '@playwright/test'
import { PageObject } from './PageObject'
import { GristWidgetPage } from './pages/GristWidgetPage'

export class App extends PageObject {
  constructor(page: Page) {
    super({ page })
  }

  get gristWidget() {
    return new GristWidgetPage(this.context)
  }
}