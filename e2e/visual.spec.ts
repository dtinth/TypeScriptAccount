import { test, expect } from '@playwright/test'
import { App } from './support/App'

test.describe('Visual Testing - Document Layouts', () => {
  test('generates screenshots for all scenarios', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    // Import scenarios dynamically to get the latest data
    const scenarios = await import('../src/utils/scenarios').then(m => m.scenarios)
    
    for (const scenario of scenarios) {
      await test.step(`Screenshot: ${scenario.title}`, async () => {
        await widget.goto()
        await widget.waitForAppLoad()
        
        // Dispatch the scenario data
        await widget.dispatchMockRecord(scenario.data)
        await widget.waitForContent()
        
        // Hide UI elements for clean screenshot
        await widget.hideUIElementsForScreenshot()
        
        // Take screenshot with scenario slug as filename
        await widget.takeScreenshot(`${scenario.slug}.png`)
      })
    }
  })

  test('responsive design screenshots', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
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
        await widget.setViewport(viewport.width, viewport.height)
        await widget.goto()
        await widget.waitForAppLoad()
        
        await widget.dispatchMockRecord(testScenario.data)
        await widget.waitForContent()
        
        // Hide action elements for clean screenshot
        await widget.hideUIElementsForScreenshot()
        
        await widget.takeScreenshot(`${testScenario.slug}-${viewport.name}.png`)
      })
    }
  })

  test('special states screenshots', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await test.step('Loading state', async () => {
      await widget.goto()
      await widget.waitForLoading()
      await widget.takeScreenshot('loading-state.png')
    })

    await test.step('Error state', async () => {
      await widget.goto()
      await widget.waitForAppLoad()
      
      await widget.dispatchInvalidData()
      await expect(widget.error).toBeVisible()
      await widget.takeScreenshot('error-state.png')
    })

    await test.step('No data state', async () => {
      await widget.goto()
      await widget.waitForAppLoad()
      
      // Dispatch null to trigger no data state
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent('mockgristrecord', {
          detail: null
        }))
      })
      
      // Wait a moment for the state to process
      await widget.app.waitFor()
      await widget.takeScreenshot('no-data-state.png')
    })

    await test.step('Settings panel open', async () => {
      await widget.goto()
      await widget.waitForContent()
      
      // Open settings and add sample CSS
      await widget.openSettings()
      await widget.setCustomCSS(`.document {
  --font-family: Comic Sans MS, Itim, sans-serif;
  --primary-color: #ff6b6b;
}`)
      
      await widget.takeScreenshot('settings-panel.png')
    })
  })

  test('signed document state', async ({ page }) => {
    const app = new App(page)
    const widget = app.gristWidget
    
    await widget.goto()
    await widget.waitForAppLoad()
    
    // Load signed document scenario
    const scenarios = await import('../src/utils/scenarios').then(m => m.scenarios)
    const signedScenario = scenarios.find(s => s.slug === 'signed-demo')!
    
    await widget.dispatchMockRecord(signedScenario.data)
    await expect(widget.signedDocument).toBeVisible()
    
    await widget.takeScreenshot('signed-document.png')
  })
})