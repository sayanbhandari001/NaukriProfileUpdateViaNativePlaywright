const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const gulfTalentAccount = {
  label: 'GulfTalent profile account',
  emailKey: 'GULFTALENT_EMAIL',
  passwordKey: 'GULFTALENT_PASSWORD',
  expectedHeadline: 'Senior SDET/Test Lead, 8+ yrs in BFSI & Payments (ISO 8583, card auth, clearing, settlement, chargebacks). Expert: Playwright, Selenium-Java, RestAssured, Cucumber BDD, jPOS, Jenkins, GitHub Actions, Allure, API Testing & Automation Frameworks',
  priority: 6,
};

test.describe('@international @priority-6 GulfTalent Accounts', () => {
  test(`[Priority ${gulfTalentAccount.priority}] ${gulfTalentAccount.label}`, async ({ gulfTalentApp }) => {
    const email = requireEnvValue(gulfTalentAccount.emailKey);
    const passwordBase64 = requireEnvValue(gulfTalentAccount.passwordKey);
    await gulfTalentApp.login(email, decodeBase64(passwordBase64));
    await gulfTalentApp.profilePage.gotoEditor();
    await gulfTalentApp.profilePage.updateHeadline(
      gulfTalentAccount.expectedHeadline,
      `${gulfTalentAccount.expectedHeadline}.`
    );
    await gulfTalentApp.logout();
  });
});
