const { test, expect } = require('@playwright/test');
const { requireEnvValue, decodeBase64 } = require('./utils');

const gulfAccount = {
  label: 'Gulf profile account',
  emailKey: 'GULF_NAUKRI_EMAIL',
  passwordKey: 'GULF_NAUKRI_PASSWORD',
};

async function loginToGulfNaukri(page, email, password) {
  await page.goto('https://www.naukrigulf.com/jobseeker/login');
  await page.fill('input#loginPageLoginEmail', email);
  await page.fill('input#loginPassword', password);
  await page.locator('button:has-text("Login")').first().click();
  // Wait for the login form to go away which indicates post-login state
  await page.waitForSelector('input#loginPageLoginEmail', { state: 'detached' });
}

async function openGulfProfileEditor(page) {
  try {
    await page.goto('https://www.naukrigulf.com/mnj/userProfile/myCV?source=gnbHeader', { waitUntil: 'networkidle' });
  } catch (error) {
    console.warn('Direct navigation failed, attempting fallback navigation:', error.message);
    await page.goto('https://www.naukrigulf.com/mnj/userProfile/myHome?conmnj=1&source=', { waitUntil: 'networkidle' });
    const profileLink = page.locator('text=My Profile').first();
    await profileLink.waitFor({ state: 'visible' });
    await profileLink.click();
    await page.waitForLoadState('networkidle');
  }

  const editButton = page.locator('section#cvHeadline button:has-text("Edit")').or(page.locator('button:has-text("Edit CV Headline")'));
  await editButton.waitFor({ state: 'visible' });
  await editButton.click();
  await expect(page.locator('textarea#cvHeadline')).toBeVisible();
}

async function updateGulfHeadline(page) {
  const textarea = page.locator('textarea#cvHeadline');
  await textarea.waitFor({ state: 'visible' });
  const expectedHeadline = '8 Years Experienced Senior QA Automation Tester, Selenium, Java, Playwright';
  const alternateHeadline = `${expectedHeadline}.`;
  const currentHeadline = (await textarea.inputValue()).trim();
  if (currentHeadline === expectedHeadline) {
    await textarea.fill(alternateHeadline);
  } else {
    await textarea.fill(expectedHeadline);
  }
  await page.locator('button:has-text("Save")').click();
  const toastTitle = page.locator('h4', { hasText: 'Profile updated successfully' });
  await expect(toastTitle).toBeVisible();
}

test(gulfAccount.label, async ({ page }) => {
  const email = requireEnvValue(gulfAccount.emailKey);
  const passwordBase64 = requireEnvValue(gulfAccount.passwordKey);
  await loginToGulfNaukri(page, email, decodeBase64(passwordBase64));
  await openGulfProfileEditor(page);
  await updateGulfHeadline(page);
});
