require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  // Use Playwright defaults for test and expect timeouts; avoid overriding here
  fullyParallel: true,
  workers: 2,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    headless: process.env.CI ? true : false,  // Headless in CI, headed locally
    ignoreHTTPSErrors: true,
    // Rely on Playwright's default action/navigation timeouts for robustness
    viewport: { width: 1360, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox']
    },
    screenshot: 'only-on-failure',
    video: 'retry-with-video'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      }
     }
// ,
    // {
    //   name: 'firefox',
    //   use: { 
    //     browserName: 'firefox',
    //   },
    // }
    
  ]
});
