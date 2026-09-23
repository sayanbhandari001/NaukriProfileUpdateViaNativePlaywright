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
    // A dropped session silently renders a login form instead of the profile — the form's
    // ids differ between login.naukri.com and www.naukri.com, so match on the placeholder.
    const loginForm = this.page.getByPlaceholder(/Enter Email ID/i);
    if (await loginForm.first().isVisible().catch(() => false)) {
      await this.page.waitForTimeout(5000);
      await this.page.goto(profileUrl, { waitUntil: 'load' });
      if (await loginForm.first().isVisible().catch(() => false)) {
        throw new Error(`Naukri dropped the session: ${profileUrl} served the login form instead of the profile.`);
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
