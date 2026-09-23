const { expect } = require('@playwright/test');

class NaukriLogoutPage {
  constructor(page) {
    this.page = page;
    this.profileIcon = page.getByRole('img', { name: 'naukri user profile img' });
    this.logoutButton = page.getByText('Logout').first();
    this.loginLink = page.getByRole('link', { name: 'Login', exact: true });
    this.closeUpdatedDrawer = page.locator('div.lightbox.profileEditDrawer.profileUpdatedProLayer.model_open.flipOpen span:has-text("CrossLayer")');
  }

  async closeDrawerIfVisible() {
    if (await this.closeUpdatedDrawer.isVisible()) {
      await this.closeUpdatedDrawer.click();
    }
  }

  async logout() {
    await this.closeDrawerIfVisible();
    // The profile menu is not always rendered (layout varies by account), so fall back
    // to the logout URL rather than guessing at the header markup.
    try {
      await this.profileIcon.click({ timeout: 10000 });
      await this.logoutButton.click({ timeout: 10000 });
    } catch {
      await this.page.goto('https://www.naukri.com/nlogin/logout', { waitUntil: 'domcontentloaded' });
    }
    await expect(this.profileIcon).toBeHidden({ timeout: 15000 });
  }
}

module.exports = { NaukriLogoutPage };
