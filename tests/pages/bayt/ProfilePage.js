const { expect } = require('@playwright/test');

class BaytProfilePage {
  constructor(page) {
    this.page = page;
    this.editTargetJobButton = page.locator('#editTargetJob');
    this.objectivesTextarea = page.locator('#targetJobForm_objectives');
    this.saveButton = page.locator('#submitCVForm');
    this.cookieAcceptButton = page.locator('button:has-text("Accept cookies")');
  }

  async #dismissCookieBanner() {
    try {
      await this.cookieAcceptButton.click({ timeout: 3000 });
      await expect(this.cookieAcceptButton).toBeHidden({ timeout: 3000 });
    } catch {
      // banner not present
    }
  }

  async gotoEditor() {
    await this.page.goto('https://www.bayt.com/en/mycvs/', { waitUntil: 'domcontentloaded' });
    await expect(this.editTargetJobButton).toBeVisible({ timeout: 30000 });
    await this.editTargetJobButton.scrollIntoViewIfNeeded();
    await this.editTargetJobButton.click();

    // Cookie banner loads async and may intercept the edit click —
    // if textarea doesn't open, dismiss banner and retry
    try {
      await expect(this.objectivesTextarea).toBeVisible({ timeout: 5000 });
    } catch {
      await this.#dismissCookieBanner();
      await this.editTargetJobButton.click();
      await expect(this.objectivesTextarea).toBeVisible({ timeout: 15000 });
    }
  }

  async updateObjectives(expectedObjectives, alternateObjectives) {
    const current = (await this.objectivesTextarea.inputValue()).trim();
    await this.objectivesTextarea.fill(current === expectedObjectives ? alternateObjectives : expectedObjectives);
    await this.saveButton.click();
    await expect(this.objectivesTextarea).toBeHidden();
  }
}

module.exports = { BaytProfilePage };
