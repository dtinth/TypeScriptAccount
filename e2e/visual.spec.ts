import { test, expect } from '@playwright/test'

test.describe('Visual Testing - Document Layouts', () => {
  test('generates screenshots for all scenarios', async ({ page }) => {
    // Import scenarios dynamically to get the latest data
    const scenarios = await import('../src/utils/scenarios').then(m => m.scenarios)
    
    for (const scenario of scenarios) {
      await test.step(`Screenshot: ${scenario.title}`, async () => {
        await page.goto('/')
        
        // Wait for initial load
        await expect(page.locator('.app')).toBeVisible()
        
        // Dispatch the scenario data
        await page.evaluate((data) => {
          document.dispatchEvent(new CustomEvent('mockgristrecord', {
            detail: data
          }))
        }, scenario.data)
        
        // Wait for content to render
        await expect(page.locator('.app__content')).toBeVisible()
        
        // Hide settings and action buttons for clean screenshot
        await page.addStyleTag({
          content: `
            .action-buttons { display: none !important; }
            .app__settings { display: none !important; }
          `
        })
        
        // Take screenshot with scenario slug as filename
        await page.screenshot({
          path: `e2e-results/${scenario.slug}.png`,
          fullPage: true
        })
      })
    }
  })

  test('responsive design screenshots', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1200, height: 800 }
    ]
    
    // Use first scenario for responsive testing
    const scenarios = await import('../src/utils/scenarios').then(m => m.scenarios)
    const testScenario = scenarios[0] // K8s bug hunt scenario
    
    for (const viewport of viewports) {
      await test.step(`Responsive ${viewport.name} - ${testScenario.title}`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
        
        await expect(page.locator('.app')).toBeVisible()
        
        await page.evaluate((data) => {
          document.dispatchEvent(new CustomEvent('mockgristrecord', {
            detail: data
          }))
        }, testScenario.data)
        
        await expect(page.locator('.app__content')).toBeVisible()
        
        // Hide action elements for clean screenshot
        await page.addStyleTag({
          content: `
            .action-buttons { display: none !important; }
            .app__settings { display: none !important; }
          `
        })
        
        await page.screenshot({
          path: `e2e-results/${testScenario.slug}-${viewport.name}.png`,
          fullPage: true
        })
      })
    }
  })

  test('special states screenshots', async ({ page }) => {
    await test.step('Loading state', async () => {
      await page.goto('/')
      
      // Capture loading state immediately
      await expect(page.locator('.app__loading')).toBeVisible()
      await page.screenshot({
        path: 'e2e-results/loading-state.png',
        fullPage: true
      })
    })

    await test.step('Error state', async () => {
      await page.goto('/')
      await expect(page.locator('.app')).toBeVisible()
      
      // Dispatch invalid data to trigger error
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent('mockgristrecord', {
          detail: { invalid: 'data' }
        }))
      })
      
      await expect(page.locator('.app__error')).toBeVisible()
      await page.screenshot({
        path: 'e2e-results/error-state.png',
        fullPage: true
      })
    })

    await test.step('No data state', async () => {
      await page.goto('/')
      await expect(page.locator('.app')).toBeVisible()
      
      // Dispatch null to trigger no data state
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent('mockgristrecord', {
          detail: null
        }))
      })
      
      // Wait a moment for the state to process
      await page.locator('.app').waitFor()
      
      await page.screenshot({
        path: 'e2e-results/no-data-state.png',
        fullPage: true
      })
    })

    await test.step('Settings panel open', async () => {
      await page.goto('/')
      await expect(page.locator('.app__content')).toBeVisible()
      
      // Open settings
      await page.click('.app__settings-toggle')
      await expect(page.locator('.app__settings-content')).toBeVisible()
      
      // Add some sample CSS to show the interface
      await page.fill('#custom-css', `.document {
  --font-family: Comic Sans MS, Itim, sans-serif;
  --primary-color: #ff6b6b;
}`)
      
      await page.screenshot({
        path: 'e2e-results/settings-panel.png',
        fullPage: true
      })
    })
  })

  test('signed document state', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.app')).toBeVisible()
    
    // Load signed document scenario
    const scenarios = await import('../src/utils/scenarios').then(m => m.scenarios)
    const signedScenario = scenarios.find(s => s.slug === 'signed-demo')!
    
    await page.evaluate((data) => {
      document.dispatchEvent(new CustomEvent('mockgristrecord', {
        detail: data
      }))
    }, signedScenario.data)
    
    await expect(page.locator('.app__signed')).toBeVisible()
    
    await page.screenshot({
      path: 'e2e-results/signed-document.png',
      fullPage: true
    })
  })
})