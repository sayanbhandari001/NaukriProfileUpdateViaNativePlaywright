const { expect } = require('@playwright/test');

class BaytLogoutPage {
  constructor(page) {
    this.page = page;
    this.loggedOutHeading = page.locator('h1, h2').filter({ hasText: /logged out/i }).first();
  }

  async logout() {
    await this.page.goto('https://www.bayt.com/en/user-login/user-login/logout-js/', { waitUntil: 'load' });
    await this.page.waitForLoadState('networkidle');
    await expect(this.loggedOutHeading).toBeVisible();
  }
}

module.exports = { BaytLogoutPage };
