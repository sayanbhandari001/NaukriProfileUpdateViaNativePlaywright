const { expect } = require('@playwright/test');
const { FOUNDIT_SG_BASE_URL } = require('./LoginPage');

class FounditLogoutPage {
  constructor(page, baseUrl = FOUNDIT_SG_BASE_URL) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.loggedOutHeading = page.locator('h1, h2').filter({ hasText: /logged out successfully/i }).first();
  }

  async logout() {
    await this.page.goto(`${this.baseUrl}/rio/logout`, { waitUntil: 'domcontentloaded' });
    await expect(this.loggedOutHeading).toBeVisible();
  }
}

module.exports = { FounditLogoutPage };
