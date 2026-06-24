const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const gulfAccount = {
  label: 'Gulf profile account',
  emailKey: 'GULF_NAUKRI_EMAIL',
  passwordKey: 'GULF_NAUKRI_PASSWORD',
  expectedHeadline: '8 Years Experienced Senior QA Automation Tester, Selenium, Java, Playwright',
  priority: 1,
};

test.describe('@international @priority-1 Gulf Accounts', () => {
  test(`[Priority ${gulfAccount.priority}] ${gulfAccount.label}`, async ({ gulfApp }) => {
    const email = requireEnvValue(gulfAccount.emailKey);
    const passwordBase64 = requireEnvValue(gulfAccount.passwordKey);
    await gulfApp.login(email, decodeBase64(passwordBase64));
    await gulfApp.profilePage.gotoEditor();
    await gulfApp.profilePage.updateHeadline(
      gulfAccount.expectedHeadline,
      `${gulfAccount.expectedHeadline}.`
    );
    await gulfApp.logout();
  });
});