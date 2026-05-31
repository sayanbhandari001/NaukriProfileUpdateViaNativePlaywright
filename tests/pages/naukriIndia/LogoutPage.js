const { expect } = require('@playwright/test');

class NaukriLogoutPage {
  constructor(page) {
    this.page = page;
    this.profileIcon = page.getByRole('img', { name: 'naukri user profile img' });
    this.logoutButton = page.getByText('Logout').first();
    this.profileMenuButton = page.locator('div').filter({ hasText: /^2$/ }).nth(1);
    this.closeUpdatedDrawer = page.locator('div.lightbox.profileEditDrawer.profileUpdatedProLayer.model_open.flipOpen span:has-text("CrossLayer")');
  }

  async closeDrawerIfVisible() {
    if (await this.closeUpdatedDrawer.isVisible()) {
      await this.closeUpdatedDrawer.click();
    }
  }

  async openMenu() {
    if (await this.profileIcon.isVisible()) {
      await this.profileIcon.click();
    } else {
      await this.profileMenuButton.click();
    }
  }

  async logout() {
    await this.closeDrawerIfVisible();
    await this.openMenu();
    await this.logoutButton.click();
  }
}

module.exports = { NaukriLogoutPage };
