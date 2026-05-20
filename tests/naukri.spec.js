const { test, expect } = require('@playwright/test');
const { requireEnvValue, decodeBase64 } = require('./utils');

const accounts = [
  {
    label: 'India profile account 1',
    emailKey: 'NAUKRI_USER_1_EMAIL',
    passwordKey: 'NAUKRI_USER_1_PASSWORD',
  },
  {
    label: 'India profile account 2',
    emailKey: 'NAUKRI_USER_2_EMAIL',
    passwordKey: 'NAUKRI_USER_2_PASSWORD',
  },
  {
    label: 'India profile account 3',
    emailKey: 'NAUKRI_USER_3_EMAIL',
    passwordKey: 'NAUKRI_USER_3_PASSWORD',
  }
];

const wifeAccount = {
  label: 'India profile wife account',
  emailKey: 'NAUKRI_WIFE_EMAIL',
  passwordKey: 'NAUKRI_WIFE_PASSWORD',
};

const expectedHeadline =
  '8 Years Experienced Senior QA Automation Tester| Selenium | Java | Playwright | PostMan | Rest Assured | SQL | TestNG | Cucumber BDD | Maven | Jenkins | Git | CI/CD | Framework Development | Functional & Regression Testing | Agile | API Testing';
const alternateHeadline = `${expectedHeadline}.`;
const wifeHeadline =
  'Healthcare professional with 6+ years of Exp. in hospital operations, including bed management, patient admissions and discharges, accounts payable, and FOS data management. Experienced in coordinating OPD, IPD, and emergency services, and support.';
const alternateWifeHeadline = `${wifeHeadline}.`

async function loginToNaukri(page, email, password) {
  await page.goto('https://login.naukri.com/nLogin/Login.php');
  await page.fill('input#usernameField', email);
  await page.fill('input#passwordField', password);
    await page.locator('button:has-text("Login")').first().click();
    // Wait for the login form to go away which indicates post-login state
    await page.waitForSelector('input#usernameField', { state: 'detached' });
}

async function openHeadlineEditor(page) {
  await page.goto('https://www.naukri.com/mnjuser/profile?id=&altresid');
  await page.waitForLoadState();
  await page.locator("text=Resume headline").first().waitFor({ state: 'visible' });
  await page.locator(
    "//div[@class='widgetHead']/span[contains(text(),'Resume headline')]/following-sibling::span"
  ).click();
  await page.locator('form[name="resumeHeadlineForm"] textarea').waitFor({ state: 'visible' });
}

async function updateHeadline(page, targetText, alternateText) {
  const textarea = page.locator('form[name="resumeHeadlineForm"] textarea');
  await textarea.waitFor({ state: 'visible' });
  const actualText = (await textarea.inputValue()).trim();
  if (actualText === targetText) {
    await textarea.fill(alternateText);
  } else {
    await textarea.fill(targetText);
  }
  await page.locator('form[name="resumeHeadlineForm"] button[type="submit"]', { hasText: 'Save' }).click();
  await page.waitForLoadState();
  await expect(page).toHaveURL('https://www.naukri.com/mnjuser/profile?id=&altresid');
}

for (const account of accounts) {
  test(account.label, async ({ page }) => {
    const email = requireEnvValue(account.emailKey);
    const passwordBase64 = requireEnvValue(account.passwordKey);
    await loginToNaukri(page, email, decodeBase64(passwordBase64));
    await openHeadlineEditor(page);
    await updateHeadline(page, expectedHeadline, alternateHeadline);
  });
}

test(wifeAccount.label, async ({ page }) => {
  const email = requireEnvValue(wifeAccount.emailKey);
  const passwordBase64 = requireEnvValue(wifeAccount.passwordKey);
  await loginToNaukri(page, email, decodeBase64(passwordBase64));
  await openHeadlineEditor(page);
  await updateHeadline(page, wifeHeadline, alternateWifeHeadline);
});
