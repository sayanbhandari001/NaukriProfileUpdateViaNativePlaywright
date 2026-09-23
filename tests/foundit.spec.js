const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const founditAccount = {
  label: 'Foundit profile account',
  emailKey: 'FOUNDIT_EMAIL',
  passwordKey: 'FOUNDIT_PASSWORD',
  expectedSummary: 'Senior SDET/Test Lead, 8+ yrs in BFSI & Payments (ISO 8583, card auth, clearing, settlement, chargebacks). Expert: Playwright, Selenium-Java, RestAssured, Cucumber BDD, jPOS, Jenkins, GitHub Actions, Allure, API Testing & Automation Frameworks',
  priority: 5,
};

test.describe('@international @priority-5 Foundit Accounts', () => {
  test(`[Priority ${founditAccount.priority}] ${founditAccount.label}`, async ({ founditApp }) => {
    const email = requireEnvValue(founditAccount.emailKey);
    const passwordBase64 = requireEnvValue(founditAccount.passwordKey);
    await founditApp.login(email, decodeBase64(passwordBase64));
    await founditApp.profilePage.gotoEditor();
    await founditApp.profilePage.updateSummary(
      founditAccount.expectedSummary,
      `${founditAccount.expectedSummary}.`
    );
    await founditApp.logout();
  });
});
