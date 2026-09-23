const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const indeedAccount = {
  label: 'Indeed UAE profile account',
  emailKey: 'INDEED_EMAIL',
  passwordKey: 'INDEED_PASSWORD',
  expectedSummary: 'Senior SDET/Test Lead, 8+ yrs in BFSI & Payments (ISO 8583, card auth, clearing, settlement, chargebacks). Expert: Playwright, Selenium-Java, RestAssured, Cucumber BDD, jPOS, Jenkins, GitHub Actions, Allure, API Testing & Automation Frameworks',
  priority: 7,
};

test.describe('@international @priority-7 Indeed UAE Accounts', () => {
  // Credentials are optional for now — skip instead of failing the whole scheduled run
  test.skip(!process.env.INDEED_EMAIL?.trim(), 'INDEED_EMAIL is not set');

  test(`[Priority ${indeedAccount.priority}] ${indeedAccount.label}`, async ({ indeedApp }) => {
    const email = requireEnvValue(indeedAccount.emailKey);
    const passwordBase64 = requireEnvValue(indeedAccount.passwordKey);
    await indeedApp.login(email, decodeBase64(passwordBase64));
    await indeedApp.profilePage.gotoEditor();
    await indeedApp.profilePage.updateHeadline(
      indeedAccount.expectedSummary,
      `${indeedAccount.expectedSummary}.`
    );
    await indeedApp.logout();
  });
});
