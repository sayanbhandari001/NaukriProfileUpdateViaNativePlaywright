const { expect } = require('@playwright/test');

class BaytLogoutPage {
  constructor(page) {
    this.page = page;
    this.loggedOutHeading = page.locator('h1, h2').filter({ hasText: /logged out/i }).first();
  }

  async logout() {
    await this.page.goto('https://www.bayt.com/en/user-login/user-login/logout-js/', { waitUntil: 'domcontentloaded' });
    await expect(this.loggedOutHeading).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { BaytLogoutPage };
