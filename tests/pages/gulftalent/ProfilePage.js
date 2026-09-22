const { expect } = require('@playwright/test');

class GulfTalentProfilePage {
  constructor(page) {
    this.page = page;
    // GulfTalent has no CV headline field — the free-text "Comments" section is used instead
    this.commentsSection = page.locator('#comments');
    this.editCommentsButton = this.commentsSection.locator('a[ng-click="edit(0)"]');
    this.commentsTextarea = this.commentsSection.locator('textarea');
    this.saveButton = this.commentsSection.getByRole('button', { name: 'Save' });
  }

  async gotoEditor() {
    await this.page.goto('https://www.gulftalent.com/candidates/edit-cv', { waitUntil: 'domcontentloaded' });
    await expect(this.editCommentsButton).toBeVisible({ timeout: 30000 });
    await this.editCommentsButton.scrollIntoViewIfNeeded();
    await this.editCommentsButton.click();
    await expect(this.commentsTextarea).toBeVisible();
  }

  async updateHeadline(expectedHeadline, alternateHeadline) {
    const current = (await this.commentsTextarea.inputValue()).trim();
    const newValue = current === expectedHeadline ? alternateHeadline : expectedHeadline;
    await this.commentsTextarea.fill(newValue);
    await this.saveButton.click();
    await expect(this.commentsTextarea).toBeHidden();
    await expect(this.commentsSection).toContainText(newValue);
  }
}

module.exports = { GulfTalentProfilePage };
