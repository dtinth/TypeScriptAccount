import { test, expect } from '@playwright/test'
import { App } from './support/App'

test.describe('Grist Widget Functionality', () => {
  test('displays scenario selector in mock mode', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForAppLoad()
    await widget.expectScenarioSelectorVisible()
  })

  test('loads data via DOM event dispatch', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForLoading()
    
    // Dispatch a mock record event
    const sampleData = {
      id: 999,
      Record: {
        Client: {
          Address: 'Test Address\\nTest City 12345',
          Name: 'Test Company Ltd',
          Tax_ID: '1234567890123',
          id: 1,
        },
        Date: '2025-08-09T00:00:00.000Z',
        Document_Type: ['Receipt'],
        Items: [
          {
            Description: 'Test Item',
            Document: { tableId: 'Documents', rowId: 1 },
            Manual_Sort: 1,
            Quantity: 1,
            Total: 100,
            Unit_Price: 100,
            id: 1,
          },
        ],
        Number: 'TEST-001',
        Payment_Method: {
          Account_Holder: 'Test Holder',
          Account_Number: '123-4-56789-0',
          Bank: 'Test Bank',
          Branch: 'Test Branch',
          Name: 'Test Payment',
          PromptPay: '0123456789',
          id: 1,
        },
        Provider: {
          Address: 'Provider Address\\nProvider City 54321',
          Email: 'test@provider.com',
          Name: 'Test Provider Ltd',
          Personnel_Name: 'Test Person',
          Tax_ID: '9876543210987',
          id: 1,
        },
        Reference: { Number: 'REF-001', id: 1 },
        Remarks: 'Test remarks',
        Tax: 0.07,
        id: 999,
      },
    }
    
    await widget.dispatchMockRecord(sampleData)
    
    // Should show document content
    await widget.waitForContent()
    await widget.expectActionButtonsVisible()
    
    // Should display document data
    await widget.expectDocumentNumber('TEST-001')
    await widget.expectClientName('Test Company Ltd')
  })

  test('scenario selector changes data via DOM events', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForContent()
    
    // Change scenario using dropdown
    await widget.selectScenario('receipt-vat-k8s-bug-hunt')
    
    // Should show updated document data
    await widget.expectDocumentNumber('RCPT-2025-0001')
    await widget.expectTextVisible('บริการไล่บั๊กระบบ Kubernetes')
  })

  test('custom CSS settings work with sessionStorage', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForContent()
    
    // Open settings and add custom CSS
    await widget.openSettings()
    const customCSS = '.document { background-color: red; }'
    await widget.setCustomCSS(customCSS)
    await widget.applyCustomCSS()
    
    // Check that CSS was saved to sessionStorage
    const savedCSS = await widget.getSessionStorageItem('grist_option_customCss')
    expect(JSON.parse(savedCSS!)).toBe(customCSS)
    
    // Reload page and check if CSS persists
    await widget.reload()
    await widget.waitForContent()
    await widget.openSettings()
    
    // CSS should be loaded from sessionStorage
    await widget.expectCustomCSSValue(customCSS)
  })

  test('handles invalid record data gracefully', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.dispatchInvalidData()
    await widget.expectErrorState()
  })

  test('print button is disabled when document is signed', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.selectScenario('signed-demo')
    
    await widget.expectSignedDocumentState()
    await widget.expectPrintButtonDisabled()
  })

  test('copy JSON functionality works', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForContent()
    
    // Mock clipboard API and click copy button
    await widget.mockClipboardAPI()
    await widget.copyJsonButton.click()
    
    // Check that JSON was copied
    const clipboardText = await widget.getClipboardText()
    expect(JSON.parse(clipboardText!)).toMatchObject({
      id: expect.any(Number),
      Record: expect.any(Object)
    })
  })
})