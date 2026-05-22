const { test: base, expect } = require('@playwright/test');
const { requireEnvValue, decodeBase64 } = require('./utils');
const { NaukriLoginPage } = require('./pages/naukri/LoginPage');
const { NaukriProfilePage } = require('./pages/naukri/ProfilePage');
const { NaukriLogoutPage } = require('./pages/naukri/LogoutPage');
const { GulfLoginPage } = require('./pages/gulf/LoginPage');
const { GulfProfilePage } = require('./pages/gulf/ProfilePage');
const { GulfLogoutPage } = require('./pages/gulf/LogoutPage');

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
});

module.exports = {
  test,
  expect,
  requireEnvValue,
  decodeBase64,
};
