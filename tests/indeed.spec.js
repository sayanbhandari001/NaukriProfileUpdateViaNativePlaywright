const { test, requireEnvValue, decodeBase64 } = require('./fixtures');

const indeedAccount = {
  label: 'Indeed AE profile account',
  expectedHeadline: 'Test engineer',
  priority: 8,
};

test.describe('@priority-8 Indeed Accounts', () => {
  test(`[Priority ${indeedAccount.priority}] ${indeedAccount.label}`, async ({ indeedApp }) => {
    await indeedApp.profilePage.gotoEditor();
    await indeedApp.profilePage.updateHeadline(
      indeedAccount.expectedHeadline,
      `${indeedAccount.expectedHeadline}.`
    );
    await indeedApp.logout();
  });
});
