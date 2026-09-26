const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { chromium } = require('@playwright/test');
const { NaukriLoginPage } = require('../tests/pages/naukriIndia/LoginPage');
const { NaukriProfilePage } = require('../tests/pages/naukriIndia/ProfilePage');
const { waitForPortalReady } = require('../tests/pages/portalAccess');

let browser;
before(async () => { browser = await chromium.launch({ headless: true }); });
after(async () => { await browser?.close(); });

async function withPage(run) {
  const page = await browser.newPage();
  try { await run(page); } finally { await page.close(); }
}

test('Naukri waits for a delayed login form and reports session rejection', async () => {
  await withPage(async page => {
    await page.route('https://www.naukri.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<script>setTimeout(() => { document.body.innerHTML = '<input placeholder="Enter Email ID / Username">'; }, 200);</script>`,
    }));
    await assert.rejects(new NaukriProfilePage(page).goto(), /session was not accepted/);
  });
});

test('Naukri accepts a delayed authenticated profile', async () => {
  await withPage(async page => {
    await page.route('https://www.naukri.com/**', route => route.fulfill({
      contentType: 'text/html',
      body: `<script>setTimeout(() => { document.body.innerHTML = '<span>Resume headline</span>'; }, 200);</script>`,
    }));
    await new NaukriProfilePage(page).goto();
  });
});

test('Naukri uses the same-origin login and waits for authenticated navigation', async () => {
  await withPage(async page => {
    await page.route('https://www.naukri.com/nlogin/login', route => route.fulfill({
      contentType: 'text/html',
      body: `<input id="usernameField"><input id="passwordField" type="password"><button onclick="location.href='/mnjuser/home'">Login</button>`,
    }));
    await page.route('https://www.naukri.com/mnjuser/home', route => route.fulfill({
      contentType: 'text/html', body: '<p>Signed in</p>',
    }));
    await new NaukriLoginPage(page).login('fixture@example.test', 'fixture-password');
    assert.equal(page.url(), 'https://www.naukri.com/mnjuser/home');
  });
});

test('transient verification may resolve normally without interaction', async () => {
  await withPage(async page => {
    await page.setContent(`<h2>Performing security verification</h2><script>setTimeout(() => { document.body.innerHTML = '<input id="login">'; }, 200);</script>`);
    await waitForPortalReady(page, page.locator('#login'), 'Fixture portal', 2000);
  });
});

test('persistent human verification is a failure, not a skipped or successful update', async () => {
  await withPage(async page => {
    await page.setContent('<h2>Performing security verification</h2>');
    await assert.rejects(waitForPortalReady(page, page.locator('#login'), 'Fixture portal', 100), /blocked browser access/);
  });
});

test('ordinary missing selectors are not mislabeled as access blocks', async () => {
  await withPage(async page => {
    await page.setContent('<h2>Unexpected page layout</h2>');
    await assert.rejects(waitForPortalReady(page, page.locator('#login'), 'Fixture portal', 100), error => {
      assert.equal(error.name, 'TimeoutError');
      return true;
    });
  });
});

test('failed-test diagnostics do not contain a filled password', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'portal-privacy-'));
  const canary = 'PASSWORD_CANARY_' + Date.now();
  try {
    const config = path.join(directory, 'playwright.config.cjs');
    await fs.writeFile(config, `const base = require(${JSON.stringify(path.resolve(__dirname, '../playwright.config.js'))});
module.exports = {...base, testDir: __dirname, projects: [{name:'privacy'}], workers:1, retries:0,
  use: {...base.use, headless:true, screenshot:'off', video:'off'},
  outputDir: ${JSON.stringify(path.join(directory, 'results'))}, reporter:'json'};`);
    await fs.writeFile(path.join(directory, 'privacy.spec.cjs'), `const {test} = require(${JSON.stringify(require.resolve('@playwright/test'))});
test('intentional privacy failure', async ({page}) => {
  await page.setContent('<input type="password">');
  await page.locator('input').fill(process.env.PORTAL_PASSWORD_CANARY);
  throw new Error('Intentional privacy fixture failure');
});`);
    let result;
    try {
      await promisify(execFile)(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '--config', config], {
        env: {...process.env, PORTAL_PASSWORD_CANARY: canary}, timeout: 30000,
      });
      assert.fail('The privacy fixture must fail so failure diagnostics are exercised.');
    } catch (error) {
      assert.equal(error.code, 1);
      result = error.stdout;
    }
    assert.ok(result.includes('Intentional privacy fixture failure'));
    assert.ok(!result.includes(canary), 'JSON report exposed the password canary');
    for (const entry of await fs.readdir(path.join(directory, 'results'), { recursive: true })) {
      if (!entry.endsWith('.md') && !entry.endsWith('.json')) continue;
      const content = await fs.readFile(path.join(directory, 'results', entry), 'utf8');
      assert.ok(!content.includes(canary), 'Failure artifact exposed the password canary');
    }
  } finally {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('portal-privacy-'));
    await fs.rm(directory, { recursive:true, force:true });
  }
});
