const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const founditAccount = {
  label: 'Foundit profile account',
  emailKey: 'FOUNDIT_EMAIL',
  passwordKey: 'FOUNDIT_PASSWORD',
  expectedSummary: '8 Years Experienced Senior QA Automation Tester| Selenium | Java | Playwright | PostMan | Rest Assured | SQL | TestNG | Cucumber BDD | Maven | Jenkins | Git | CI/CD | Framework Development | Functional & Regression Testing | Agile | API Testing',
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
