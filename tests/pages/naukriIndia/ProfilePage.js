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
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
    const loginForm = this.page.getByPlaceholder(/Enter Email ID/i).first();
    const headline = this.page.getByText('Resume headline', { exact: true }).first();
    // isVisible() alone returns immediately and misses a late-rendered login form.
    await expect(headline.or(loginForm).first()).toBeVisible({ timeout: 20000 });
    if (await loginForm.isVisible()) {
      throw new Error('Naukri session was not accepted: the profile page returned the login form.');
    }
    await expect(headline).toBeVisible();
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
