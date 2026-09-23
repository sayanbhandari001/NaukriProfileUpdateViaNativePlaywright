const { expect } = require('@playwright/test');

class IndeedProfilePage {
  constructor(page) {
    this.page = page;
    // Indeed profile has no CV headline field — the resume "Summary" section is used instead
    this.editSummaryButton = page.getByRole('button', { name: /edit summary|add summary/i })
      .or(page.getByRole('link', { name: /edit summary|add summary/i }));
    this.summaryTextarea = page.locator('textarea').first();
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async gotoEditor() {
    await this.page.goto('https://profile.indeed.com/?hl=en_AE&co=AE', { waitUntil: 'domcontentloaded' });
    await expect(this.editSummaryButton.first()).toBeVisible({ timeout: 30000 });
    await this.editSummaryButton.first().scrollIntoViewIfNeeded();
    await this.editSummaryButton.first().click();
    await expect(this.summaryTextarea).toBeVisible();
  }

  async updateHeadline(expectedHeadline, alternateHeadline) {
    const current = (await this.summaryTextarea.inputValue()).trim();
    const newValue = current === expectedHeadline ? alternateHeadline : expectedHeadline;
    await this.summaryTextarea.fill(newValue);
    await this.saveButton.click();
    await expect(this.summaryTextarea).toBeHidden();
    await expect(this.page.getByText(newValue, { exact: true })).toBeVisible();
  }
}

module.exports = { IndeedProfilePage };
