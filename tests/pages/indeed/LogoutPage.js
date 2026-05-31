const { expect } = require('@playwright/test');

class IndeedLogoutPage {
  constructor(page) {
    this.page = page;
    this.loginHeading = page.locator('h1').filter({ hasText: /sign in|ready to take/i }).first();
  }

  async logout() {
    await this.page.goto('https://secure.indeed.com/account/logout', { waitUntil: 'domcontentloaded' });
    await expect(this.loginHeading).toBeVisible();
  }
}

module.exports = { IndeedLogoutPage };
