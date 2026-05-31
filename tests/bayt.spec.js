const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const baytAccount = {
  label: 'Bayt profile account',
  emailKey: 'BAYT_EMAIL',
  passwordKey: 'BAYT_PASSWORD',
  expectedObjectives: 'Experienced Senior Test Analyst proficient in Selenium, Java, SQL, and CICD, with skills in TestNG, Maven, GIT, Cucumber, Jenkins, and PowerBI. Expert in Agile & Waterfall SDLC, Performance Testing, and Test Automation Scripting',
  priority: 6,
};

test.describe('@priority-6 Bayt Accounts', () => {
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
