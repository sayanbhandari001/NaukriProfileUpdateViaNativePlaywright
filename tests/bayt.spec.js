const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const baytAccount = {
  label: 'Bayt profile account',
  emailKey: 'BAYT_EMAIL',
  passwordKey: 'BAYT_PASSWORD',
  expectedObjectives: 'Senior SDET/Test Lead, 9+ yrs in BFSI & Payments (ISO 8583, card auth, clearing, settlement, chargebacks), currently leading QA for AI/Voice products at Assigncorp. Expert: Playwright, Selenium-Java, RestAssured, Cucumber BDD, jPOS, Jenkins, GitHub Actions, Allure, API Testing & Automation Frameworks. Open to Test Lead/SDET roles across the UAE, relocating to Dubai/Abu Dhabi.',
  priority: 4,
};

test.describe('@international @priority-4 Bayt Accounts', () => {
  test(`[Priority ${baytAccount.priority}] ${baytAccount.label}`, async ({ baytApp }) => {
    const email = requireEnvValue(baytAccount.emailKey);
    const passwordBase64 = requireEnvValue(baytAccount.passwordKey);
    await baytApp.login(email, decodeBase64(passwordBase64));
    await baytApp.profilePage.gotoEditor();
    await baytApp.profilePage.updateObjectives(
      baytAccount.expectedObjectives,
      `${baytAccount.expectedObjectives}.`
    );
    await baytApp.logout();
  });
});
