require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  // Use Playwright defaults for test and expect timeouts; avoid overriding here
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    // Job portals block headless browsers ("Access Denied"), so run headed by default.
    // CI provides a virtual display via xvfb-run. Set HEADLESS=true to opt in to headless.
    headless: process.env.HEADLESS === 'true',
    ignoreHTTPSErrors: true,
    // Rely on Playwright's default action/navigation timeouts for robustness
    viewport: { width: 1366, height: 786 },
    // Indian time and locale; no Indian IP or geographic location is required.
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox']
    },
    screenshot: 'only-on-failure',
    video: 'retry-with-video'
  },
  projects: [
    // Regional grouping projects
    {
      name: 'india',
      grep: /@india/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'international',
      grep: /@international/,
      use: { browserName: 'chromium' },
    },
    
    // Priority-based projects
    {
      name: 'priority-1',
      grep: /@priority-1/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-2',
      grep: /@priority-2/,
      dependencies: ['priority-1'],
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-3',
      grep: /@priority-3/,
      dependencies: ['priority-2'],
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-4',
      grep: /@priority-4/,
      dependencies: ['priority-3'],
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-5',
      grep: /@priority-5/,
      dependencies: ['priority-4'],
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-6',
      grep: /@priority-6/,
      dependencies: ['priority-5'],
      use: { browserName: 'chromium' },
    },
    {
      name: 'priority-7',
      grep: /@priority-7/,
      dependencies: ['priority-6'],
      use: { browserName: 'chromium' },
    },
  ]
});
