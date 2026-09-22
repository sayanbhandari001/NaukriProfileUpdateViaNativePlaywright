const { expect } = require('@playwright/test');

class GulfTalentLogoutPage {
  constructor(page) {
    this.page = page;
    this.headerLoginLink = page.getByRole('banner').getByRole('link', { name: 'Login', exact: true });
  }

  async logout() {
    await this.page.goto('https://www.gulftalent.com/home/logout.php?type=user', { waitUntil: 'domcontentloaded' });
    await expect(this.headerLoginLink).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { GulfTalentLogoutPage };
