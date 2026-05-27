const { test, expect, requireEnvValue, decodeBase64 } = require('./fixtures');

const accounts = [
  {
    label: 'India profile account 1',
    emailKey: 'NAUKRI_USER_1_EMAIL',
    passwordKey: 'NAUKRI_USER_1_PASSWORD',
    targetHeadline:
      '8 Years Experienced Senior QA Automation Tester| Selenium | Java | Playwright | PostMan | Rest Assured | SQL | TestNG | Cucumber BDD | Maven | Jenkins | Git | CI/CD | Framework Development | Functional & Regression Testing | Agile | API Testing',
    priority: 2,
  },
  {
    label: 'India profile account 2',
    emailKey: 'NAUKRI_USER_2_EMAIL',
    passwordKey: 'NAUKRI_USER_2_PASSWORD',
    targetHeadline:
      '8 Years Experienced Senior QA Automation Tester| Selenium | Java | Playwright | PostMan | Rest Assured | SQL | TestNG | Cucumber BDD | Maven | Jenkins | Git | CI/CD | Framework Development | Functional & Regression Testing | Agile | API Testing',
    priority: 2,
  },
  {
    label: 'India profile account 3',
    emailKey: 'NAUKRI_USER_3_EMAIL',
    passwordKey: 'NAUKRI_USER_3_PASSWORD',
    targetHeadline:
      '8 Years Experienced Senior QA Automation Tester| Selenium | Java | Playwright | PostMan | Rest Assured | SQL | TestNG | Cucumber BDD | Maven | Jenkins | Git | CI/CD | Framework Development | Functional & Regression Testing | Agile | API Testing',
    priority: 2,
  },
];

const wifeAccount = {
  label: 'India profile wife account',
  emailKey: 'NAUKRI_WIFE_EMAIL',
  passwordKey: 'NAUKRI_WIFE_PASSWORD',
  targetHeadline:
    'Healthcare professional with 6+ years of Exp. in hospital operations, including bed management, patient admissions and discharges, accounts payable, and FOS data management. Experienced in coordinating OPD, IPD, and emergency services, and support',
  priority: 3,
};

const buildAlternateHeadline = (headline) => `${headline}.`;

test.describe('@priority-2 India Accounts', () => {
  for (const account of accounts) {
    test(`[Priority ${account.priority}] ${account.label}`, async ({ naukriApp }) => {
      const email = requireEnvValue(account.emailKey);
      const passwordBase64 = requireEnvValue(account.passwordKey);
      await naukriApp.login(email, decodeBase64(passwordBase64));
      await naukriApp.profilePage.openHeadlineEditor();
      await naukriApp.profilePage.updateHeadline(account.targetHeadline, buildAlternateHeadline(account.targetHeadline));
      await naukriApp.logout();
    });
  }
});

test.describe('@priority-3 Wife Account', () => {
  test(`[Priority ${wifeAccount.priority}] ${wifeAccount.label}`, async ({ naukriApp }) => {
    const email = requireEnvValue(wifeAccount.emailKey);
    const passwordBase64 = requireEnvValue(wifeAccount.passwordKey);
    await naukriApp.login(email, decodeBase64(passwordBase64));
    await naukriApp.profilePage.openHeadlineEditor();
    await naukriApp.profilePage.updateHeadline(wifeAccount.targetHeadline, buildAlternateHeadline(wifeAccount.targetHeadline));
    await naukriApp.logout();
  });
});