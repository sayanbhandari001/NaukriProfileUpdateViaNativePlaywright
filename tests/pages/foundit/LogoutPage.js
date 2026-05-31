const { expect } = require('@playwright/test');

class FounditLogoutPage {
  constructor(page) {
    this.page = page;
    this.loggedOutHeading = page.locator('h1, h2').filter({ hasText: /logged out successfully/i }).first();
  }

  async logout() {
    await this.page.goto('https://www.foundit.sg/rio/logout', { waitUntil: 'domcontentloaded' });
    await expect(this.loggedOutHeading).toBeVisible();
  }
}

module.exports = { FounditLogoutPage };
