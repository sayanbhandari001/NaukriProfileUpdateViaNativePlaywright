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
const { GulfTalentLoginPage } = require('./pages/gulftalent/LoginPage');
const { GulfTalentProfilePage } = require('./pages/gulftalent/ProfilePage');
const { GulfTalentLogoutPage } = require('./pages/gulftalent/LogoutPage');
const { IndeedLoginPage } = require('./pages/indeed/LoginPage');
const { IndeedProfilePage } = require('./pages/indeed/ProfilePage');
const { IndeedLogoutPage } = require('./pages/indeed/LogoutPage');

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

  gulfTalentApp: async ({ page }, use) => {
    const loginPage = new GulfTalentLoginPage(page);
    const profilePage = new GulfTalentProfilePage(page);
    const logoutPage = new GulfTalentLogoutPage(page);

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

  indeedApp: async ({ page }, use) => {
    const loginPage = new IndeedLoginPage(page);
    const profilePage = new IndeedProfilePage(page);
    const logoutPage = new IndeedLogoutPage(page);

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
