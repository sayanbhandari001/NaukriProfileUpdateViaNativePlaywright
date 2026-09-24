const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const founditGulfAccount = {
  label: 'Foundit Gulf (UAE) profile account',
  emailKey: 'FOUNDIT_GULF_EMAIL',
  passwordKey: 'FOUNDIT_GULF_PASSWORD',
  expectedSummary: 'Senior SDET/Test Lead, 9+ yrs in BFSI & Payments (ISO 8583, card auth, clearing, settlement, chargebacks), currently leading QA for AI/Voice products at Assigncorp. Expert: Playwright, Selenium-Java, RestAssured, Cucumber BDD, jPOS, Jenkins, GitHub Actions, Allure, API Testing & Automation Frameworks. Open to Test Lead/SDET roles across the UAE, relocating to Dubai/Abu Dhabi.',
  priority: 5,
};

test.describe('@international @priority-5 Foundit Gulf Accounts', () => {
  // founditgulf.com is a separate account from foundit.sg — skip instead of failing
  // the whole scheduled run while the credentials are not configured yet.
  test.skip(!process.env.FOUNDIT_GULF_EMAIL?.trim(), 'FOUNDIT_GULF_EMAIL is not set');

  test(`[Priority ${founditGulfAccount.priority}] ${founditGulfAccount.label}`, async ({ founditGulfApp }) => {
    const email = requireEnvValue(founditGulfAccount.emailKey);
    const passwordBase64 = requireEnvValue(founditGulfAccount.passwordKey);
    await founditGulfApp.login(email, decodeBase64(passwordBase64));
    await founditGulfApp.profilePage.gotoEditor();
    await founditGulfApp.profilePage.updateSummary(
      founditGulfAccount.expectedSummary,
      `${founditGulfAccount.expectedSummary}.`
    );
    await founditGulfApp.logout();
  });
});
