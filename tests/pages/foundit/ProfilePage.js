const { expect } = require('@playwright/test');

class FounditProfilePage {
  constructor(page) {
    this.page = page;
    this.editSummaryButton = page.locator('#SUMMARY #SECTION_EDIT_BUTTON');
    this.summaryTextarea = page.locator('textarea#summary');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
  }

  async gotoEditor() {
    await this.page.goto('https://www.foundit.sg/seeker/profile', { waitUntil: 'domcontentloaded' });
    await expect(this.editSummaryButton).toBeVisible({ timeout: 30000 });
    await this.editSummaryButton.click();
    await expect(this.summaryTextarea).toBeVisible();
  }

  async updateSummary(expectedSummary, alternateSummary) {
    const current = (await this.summaryTextarea.inputValue()).trim();
    const newValue = current === expectedSummary ? alternateSummary : expectedSummary;
    await this.summaryTextarea.fill(newValue);
    await this.saveButton.click();
    await expect(this.summaryTextarea).toBeHidden();
  }
}

module.exports = { FounditProfilePage };
