const { test: base, expect } = require('@playwright/test');
const { requireEnvValue, decodeBase64 } = require('./utils');
const { NaukriLoginPage } = require('./pages/naukriIndia/LoginPage');
const { NaukriProfilePage } = require('./pages/naukriIndia/ProfilePage');
const { NaukriLogoutPage } = require('./pages/naukriIndia/LogoutPage');
const { GulfLoginPage } = require('./pages/gulf/LoginPage');
const { GulfProfilePage } = require('./pages/gulf/ProfilePage');
const { GulfLogoutPage } = require('./pages/gulf/LogoutPage');
const { BaytLoginPage } = require('./pages/bayt/LoginPage');
const { BaytProfilePage } = require('./pages/bayt/ProfilePage');
const { BaytLogoutPage } = require('./pages/bayt/LogoutPage');
const { FounditLoginPage } = require('./pages/foundit/LoginPage');
const { FounditProfilePage } = require('./pages/foundit/ProfilePage');
const { FounditLogoutPage } = require('./pages/foundit/LogoutPage');
const { IndeedProfilePage } = require('./pages/indeed/ProfilePage');
const { IndeedLogoutPage } = require('./pages/indeed/LogoutPage');
const path = require('path');
const fs = require('fs');
const INDEED_AUTH_PATH = path.join(__dirname, '..', '.auth', 'indeed.json');

const test = base.extend({
  naukriApp: async ({ page }, use) => {
    const loginPage = new NaukriLoginPage(page);
    const profilePage = new NaukriProfilePage(page);
    const logoutPage = new NaukriLogoutPage(page);

    await use({
      loginPage,
      profilePage,
      logoutPage,
      login: async (email, password) => {
        await loginPage.login(email, password);
      },
      logout: async () => {
        await logoutPage.logout();
      },
    });
  },

  gulfApp: async ({ page }, use) => {
    const loginPage = new GulfLoginPage(page);
    const profilePage = new GulfProfilePage(page);
    const logoutPage = new GulfLogoutPage(page);

    await use({
      loginPage,
      profilePage,
      logoutPage,
      login: async (email, password) => {
        await loginPage.login(email, password);
      },
      logout: async () => {
        await logoutPage.logout();
      },
    });
  },

  baytApp: async ({ page }, use) => {
    const loginPage = new BaytLoginPage(page);
    const profilePage = new BaytProfilePage(page);
    const logoutPage = new BaytLogoutPage(page);

    await use({
      loginPage,
      profilePage,
      logoutPage,
      login: async (email, password) => {
        await loginPage.login(email, password);
      },
      logout: async () => {
        await logoutPage.logout();
      },
    });
  },

  indeedApp: async ({ browser }, use) => {
    if (!fs.existsSync(INDEED_AUTH_PATH)) {
      throw new Error('Indeed session not found. Run: node scripts/indeed-setup-auth.js');
    }
    const context = await browser.newContext({
      storageState: INDEED_AUTH_PATH,
      viewport: { width: 1360, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    const profilePage = new IndeedProfilePage(page);
    const logoutPage = new IndeedLogoutPage(page);

    await use({
      profilePage,
      logoutPage,
      logout: async () => {
        await logoutPage.logout();
      },
    });

    await context.close();
  },

  founditApp: async ({ page }, use) => {
    const loginPage = new FounditLoginPage(page);
    const profilePage = new FounditProfilePage(page);
    const logoutPage = new FounditLogoutPage(page);

    await use({
      loginPage,
      profilePage,
      logoutPage,
      login: async (email, password) => {
        await loginPage.login(email, password);
      },
      logout: async () => {
        await logoutPage.logout();
      },
    });
  },
});

module.exports = {
  test,
  expect,
  requireEnvValue,
  decodeBase64,
};
