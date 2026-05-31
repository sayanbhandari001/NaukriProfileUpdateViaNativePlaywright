const { chromium } = require('@playwright/test');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: path.join(__dirname, '..', '.auth', 'indeed.json'),
    viewport: { width: 1360, height: 768 },
  });
  const page = await context.newPage();

  await page.goto('https://profile.indeed.com/preferences/job-title', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await page.locator('#edit-jobTitles').click();
  await page.waitForTimeout(1500);

  // Read current value
  const input = page.locator('input[aria-label="Add up to ten job titles"]');
  const current = await input.inputValue();
  console.log('Current job title:', current);

  // Save without changing (to test success signal)
  await page.locator('#form-modal-save-button').click();
  await page.waitForTimeout(2000);

  const afterSave = await page.evaluate(() => ({
    inputGone: !document.getElementById('form-modal-save-button'),
    toastText: document.querySelector('[class*="toast"], [role="alert"], [class*="notification"]')?.textContent?.trim()?.substring(0,80),
    url: location.href,
  }));
  console.log('After save:', JSON.stringify(afterSave));

  await page.waitForTimeout(3000);
  await browser.close();
}

main().catch(console.error);
