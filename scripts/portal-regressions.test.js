const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
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
