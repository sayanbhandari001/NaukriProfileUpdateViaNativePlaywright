const { expect } = require('@playwright/test');

class BaytProfilePage {
  constructor(page) {
    this.page = page;
    this.editTargetJobButton = page.locator('#editTargetJob');
    this.objectivesTextarea = page.locator('#targetJobForm_objectives');
    this.saveButton = page.locator('#submitCVForm');
  }

  async gotoEditor() {
    await this.page.goto('https://www.bayt.com/en/mycvs/', { waitUntil: 'load' });
    await this.page.waitForLoadState('networkidle');
    await this.editTargetJobButton.waitFor({ state: 'visible' });
    await this.editTargetJobButton.click();
    await expect(this.objectivesTextarea).toBeVisible();
  }

  async updateObjectives(expectedObjectives, alternateObjectives) {
    await this.objectivesTextarea.waitFor({ state: 'visible' });
    const current = (await this.objectivesTextarea.inputValue()).trim();
    await this.objectivesTextarea.fill(current === expectedObjectives ? alternateObjectives : expectedObjectives);
    await this.saveButton.click();
    await this.objectivesTextarea.waitFor({ state: 'detached' });
  }
}

module.exports = { BaytProfilePage };
