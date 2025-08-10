import { test, expect } from '@playwright/test'

test.describe('Grist Widget Functionality', () => {
  test('displays scenario selector in mock mode', async ({ page }) => {
    await page.goto('/')
    
    // Wait for app to load
    await expect(page.locator('.app')).toBeVisible()
    
    // Should show scenario selector in mock mode
    await expect(page.locator('.action-buttons__scenario')).toBeVisible()
    await expect(page.locator('#scenario-select')).toBeVisible()
  })

  test('loads data via DOM event dispatch', async ({ page }) => {
    await page.goto('/')
    
    // Wait for initial load
    await expect(page.locator('.app__loading')).toBeVisible()
    
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
    
    await page.evaluate((data) => {
      document.dispatchEvent(new CustomEvent('mockgristrecord', {
        detail: data
      }))
    }, sampleData)
    
    // Should show document content
    await expect(page.locator('.app__content')).toBeVisible()
    await expect(page.locator('.action-buttons')).toBeVisible()
    
    // Should display document number
    await expect(page.locator('text=TEST-001')).toBeVisible()
    
    // Should display client name
    await expect(page.locator('text=Test Company Ltd')).toBeVisible()
  })

  test('scenario selector changes data via DOM events', async ({ page }) => {
    await page.goto('/')
    
    // Wait for initial load with default data
    await expect(page.locator('.app__content')).toBeVisible()
    
    // Change scenario using dropdown
    await page.selectOption('#scenario-select', 'receipt-vat-k8s-bug-hunt')
    
    // Should show updated document data
    await expect(page.locator('text=RCPT-2025-0001')).toBeVisible()
    await expect(page.locator('text=บริการไล่บั๊กระบบ Kubernetes')).toBeVisible()
  })

  test('custom CSS settings work with sessionStorage', async ({ page }) => {
    await page.goto('/')
    
    // Wait for app to load
    await expect(page.locator('.app__content')).toBeVisible()
    
    // Open settings
    await page.click('.app__settings-toggle')
    await expect(page.locator('.app__settings-content')).toBeVisible()
    
    // Add custom CSS
    const customCSS = '.document { background-color: red; }'
    await page.fill('#custom-css', customCSS)
    await page.click('.app__settings-apply')
    
    // Check that CSS was saved to sessionStorage
    const savedCSS = await page.evaluate(() => {
      return sessionStorage.getItem('grist_option_customCss')
    })
    
    expect(JSON.parse(savedCSS!)).toBe(customCSS)
    
    // Reload page and check if CSS persists
    await page.reload()
    await expect(page.locator('.app__content')).toBeVisible()
    await page.click('.app__settings-toggle')
    
    // CSS should be loaded from sessionStorage
    await expect(page.locator('#custom-css')).toHaveValue(customCSS)
  })

  test('handles invalid record data gracefully', async ({ page }) => {
    await page.goto('/')
    
    // Dispatch invalid data
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('mockgristrecord', {
        detail: { invalid: 'data' }
      }))
    })
    
    // Should show error state
    await expect(page.locator('.app__error')).toBeVisible()
    await expect(page.locator('text=เกิดข้อผิดพลาด')).toBeVisible()
    await expect(page.locator('text=ข้อมูลไม่ถูกต้อง')).toBeVisible()
  })

  test('print button is disabled when document is signed', async ({ page }) => {
    await page.goto('/')
    
    // Load signed document scenario
    await page.selectOption('#scenario-select', 'signed-demo')
    
    // Should show signed document message
    await expect(page.locator('.app__signed')).toBeVisible()
    await expect(page.locator('text=เอกสารนี้ได้ถูกลงชื่อเรียบร้อยแล้ว')).toBeVisible()
    
    // Print button should be disabled
    await expect(page.locator('.action-buttons__button--primary')).toBeDisabled()
  })

  test('copy JSON functionality works', async ({ page }) => {
    await page.goto('/')
    
    // Wait for data to load
    await expect(page.locator('.app__content')).toBeVisible()
    
    // Mock clipboard API
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            ;(window as { clipboardText?: string }).clipboardText = text
          }
        }
      })
    })
    
    // Click copy JSON button
    await page.click('.action-buttons__button--secondary')
    
    // Check that JSON was copied
    const clipboardText = await page.evaluate(() => 
      (window as { clipboardText?: string }).clipboardText
    )
    expect(JSON.parse(clipboardText)).toMatchObject({
      id: expect.any(Number),
      Record: expect.any(Object)
    })
  })
})