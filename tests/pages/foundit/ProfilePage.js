const { expect } = require('@playwright/test');

class FounditProfilePage {
  constructor(page) {
    this.page = page;
    this.editSummaryButton = page.locator('#SUMMARY #SECTION_EDIT_BUTTON');
    this.summaryTextarea = page.locator('textarea#summary');
    this.saveButton = page.locator('button:has-text("Save")').first();
  }

  async gotoEditor() {
    await this.page.goto('https://www.foundit.sg/seeker/profile', { waitUntil: 'domcontentloaded' });
    await this.editSummaryButton.waitFor({ state: 'visible' });
    await this.editSummaryButton.click();
    await expect(this.summaryTextarea).toBeVisible();
  }

  async updateSummary(expectedSummary, alternateSummary) {
    await this.summaryTextarea.waitFor({ state: 'visible' });
    const current = (await this.summaryTextarea.inputValue()).trim();
    await this.summaryTextarea.fill(current === expectedSummary ? alternateSummary : expectedSummary);
    await this.saveButton.click();
    await this.summaryTextarea.waitFor({ state: 'detached' });
  }
}

module.exports = { FounditProfilePage };
