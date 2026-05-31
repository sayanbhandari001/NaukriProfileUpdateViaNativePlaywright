const { expect } = require('@playwright/test');

class IndeedProfilePage {
  constructor(page) {
    this.page = page;
    this.editJobTitlesButton = page.locator('#edit-jobTitles');
    this.jobTitleInput = page.locator('input[aria-label="Add up to ten job titles"]');
    this.saveButton = page.locator('#form-modal-save-button');
  }

  async gotoEditor() {
    await this.page.goto('https://profile.indeed.com/preferences/job-title', { waitUntil: 'domcontentloaded' });
    await this.editJobTitlesButton.waitFor({ state: 'visible' });
    await this.editJobTitlesButton.click();
    await expect(this.jobTitleInput).toBeVisible();
  }

  async updateHeadline(expectedHeadline, alternateHeadline) {
    await this.jobTitleInput.waitFor({ state: 'visible' });
    const current = (await this.jobTitleInput.inputValue()).trim();
    await this.jobTitleInput.fill(current === expectedHeadline ? alternateHeadline : expectedHeadline);
    await this.saveButton.click();
    await this.saveButton.waitFor({ state: 'detached' });
  }
}

module.exports = { IndeedProfilePage };
