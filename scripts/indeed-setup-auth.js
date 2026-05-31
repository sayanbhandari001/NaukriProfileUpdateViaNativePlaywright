/**
 * Run this script ONCE to save your Indeed session to .auth/indeed.json
 *
 *   node scripts/indeed-setup-auth.js
 *
 * A browser window will open. Complete the Google sign-in, then wait for
 * the script to detect the redirect and save the session automatically.
 * The saved session lasts ~30 days; re-run this script when it expires.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const authDir = path.join(__dirname, '..', '.auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    viewport: { width: 1360, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  console.log('\nOpening Indeed login...');
  await page.goto('https://ae.indeed.com/account/login');

  console.log('Complete the Google sign-in in the browser window.');
  console.log('Waiting for redirect to Indeed after login (timeout: 5 min)...\n');

  // Wait until we land on a known post-login Indeed page
  await page.waitForURL(
    url => /^https:\/\/(profile|ae|in|my)\.indeed\.com/.test(url.href) &&
           !url.href.includes('/account/login') &&
           !url.href.includes('secure.indeed.com'),
    { timeout: 300_000 }
  );

  const statePath = path.join(authDir, 'indeed.json');
  await context.storageState({ path: statePath });

  console.log(`Session saved → ${statePath}`);
  console.log('You can close this window. Tests will now reuse this session.\n');

  await browser.close();
}

main().catch(err => {
  console.error('Failed to save auth:', err.message);
  process.exit(1);
});
