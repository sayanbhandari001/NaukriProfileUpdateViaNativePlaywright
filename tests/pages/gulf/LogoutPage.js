const { expect } = require('@playwright/test');

class GulfLogoutPage {
  constructor(page) {
    this.page = page;
    this.profileName = page.locator('//span[@class="profile-name"]').first();
    this.logoutLink = page.locator('//p[@id="logoutLink"]').first();
    this.logoutToast = page.locator('h4', { hasText: 'You have successfully logged out' });
  }

  async logout() {
    await this.profileName.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    await expect(this.logoutToast).toBeVisible();
  }
}

module.exports = { GulfLogoutPage };
