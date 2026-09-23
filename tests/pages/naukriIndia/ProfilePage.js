const { expect } = require('@playwright/test');

class NaukriProfilePage {
  constructor(page) {
    this.page = page;
    this.resumeHeadlineButton = page.locator("//div[@class='widgetHead']/span[contains(text(),'Resume headline')]/following-sibling::span");
    this.headlineTextarea = page.locator('form[name="resumeHeadlineForm"] textarea');
    this.saveButton = page.locator('form[name="resumeHeadlineForm"] button[type="submit"]', { hasText: 'Save' });
    this.successToast = page.getByText('Profile updated successfully');
  }

  async goto() {
    const profileUrl = 'https://www.naukri.com/mnjuser/profile?id=&altresid';
    await this.page.goto(profileUrl, { waitUntil: 'load' });
    // A dropped session silently redirects to the login form — retry once before failing,
    // so a slow session handshake does not look like a broken selector.
    if (await this.page.locator('input#usernameField').isVisible().catch(() => false)) {
      await this.page.waitForTimeout(5000);
      await this.page.goto(profileUrl, { waitUntil: 'load' });
      if (await this.page.locator('input#usernameField').isVisible().catch(() => false)) {
        throw new Error(`Naukri dropped the session: ${profileUrl} redirected back to the login form.`);
      }
    }
    await this.page.getByText('Resume headline').first().waitFor({ state: 'visible' });
  }

  async openHeadlineEditor() {
    await this.goto();
    await this.resumeHeadlineButton.click();
    await this.headlineTextarea.waitFor({ state: 'visible' });
  }

  async updateHeadline(targetText, alternateText) {
    await this.headlineTextarea.waitFor({ state: 'visible' });
    const currentText = (await this.headlineTextarea.inputValue()).trim();
    await this.headlineTextarea.fill(currentText === targetText ? alternateText : targetText);
    await Promise.all([
      this.saveButton.click(),
      this.successToast.waitFor({ state: 'visible' }),
    ]);
    await expect(this.successToast).toBeVisible();
    await expect(this.page).toHaveURL('https://www.naukri.com/mnjuser/profile?id=&altresid');
  }
}

module.exports = { NaukriProfilePage };
