const { expect } = require('@playwright/test');

class IndeedLogoutPage {
  constructor(page) {
    this.page = page;
    this.headerSignInLink = page.getByRole('banner').getByRole('link', { name: 'Sign in', exact: true });
  }

  async logout() {
    await this.page.goto('https://secure.indeed.com/account/logout?hl=en_AE&co=AE&continue=https%3A%2F%2Fae.indeed.com%2F', { waitUntil: 'domcontentloaded' });
    await this.page.goto('https://ae.indeed.com/', { waitUntil: 'domcontentloaded' });
    await expect(this.headerSignInLink).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { IndeedLogoutPage };
