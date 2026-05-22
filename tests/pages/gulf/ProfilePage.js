const { expect } = require('@playwright/test');

class GulfProfilePage {
  constructor(page) {
    this.page = page;
    this.editButton = page.locator('section#cvHeadline button:has-text("Edit")').or(page.locator('button:has-text("Edit CV Headline")'));
    this.headlineTextarea = page.locator('textarea#cvHeadline');
    this.saveButton = page.locator('button:has-text("Save")');
    this.successToast = page.locator('h4', { hasText: 'Profile updated successfully' });
    this.profileLink = page.locator('text=My Profile').first();
  }

  async gotoEditor() {
    const primaryUrl = 'https://www.naukrigulf.com/mnj/userProfile/myCV?source=gnbHeader';
    const fallbackUrl = 'https://www.naukrigulf.com/mnj/userProfile/myHome?conmnj=1&source=';

    await this.page.goto(primaryUrl, { waitUntil: 'load' });
    await this.page.waitForLoadState('networkidle');

    if (!(await this.editButton.isVisible())) {
      await this.page.goto(fallbackUrl, { waitUntil: 'load' });
      await this.page.waitForLoadState('networkidle');

      if (await this.profileLink.isVisible()) {
        await this.profileLink.click();
        await this.page.waitForLoadState('networkidle');
      }

      if (!(await this.editButton.isVisible())) {
        await this.page.goto(primaryUrl, { waitUntil: 'load' });
        await this.page.waitForLoadState('networkidle');
      }
    }

    await this.editButton.waitFor({ state: 'visible' });
    await this.editButton.click();
    await expect(this.headlineTextarea).toBeVisible();
  }

  async updateHeadline(expectedHeadline, alternateHeadline) {
    await this.headlineTextarea.waitFor({ state: 'visible' });
    const currentHeadline = (await this.headlineTextarea.inputValue()).trim();
    await this.headlineTextarea.fill(currentHeadline === expectedHeadline ? alternateHeadline : expectedHeadline);
    await this.saveButton.click();
    await expect(this.successToast).toBeVisible();
  }

}

module.exports = { GulfProfilePage };
