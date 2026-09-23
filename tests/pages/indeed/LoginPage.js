class IndeedLoginPage {
  constructor(page) {
    this.page = page;
    // Email-first flow: the password step appears only after "Continue"
    this.emailField = page.getByRole('textbox', { name: 'Email address' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.passwordField = page.locator('input[type="password"]');
    // Accounts without a password default to an emailed code — switch to password when offered
    this.usePasswordLink = page.getByRole('link', { name: /sign in with (a |your )?password/i })
      .or(page.getByRole('button', { name: /sign in with (a |your )?password/i }));
    this.signInButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto(
      'https://secure.indeed.com/auth?hl=en_AE&co=AE&continue=https%3A%2F%2Fae.indeed.com%2F',
      { waitUntil: 'domcontentloaded' }
    );
    await this.emailField.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.continueButton.click();
    await this.passwordField.or(this.usePasswordLink).first().waitFor({ state: 'visible', timeout: 30000 });
    if (!(await this.passwordField.isVisible())) {
      await this.usePasswordLink.first().click();
      await this.passwordField.waitFor({ state: 'visible' });
    }
    await this.passwordField.fill(password);
    await this.signInButton.first().click();
    await this.page.waitForURL(/^https:\/\/(ae|profile|onboarding)\.indeed\.com\//, { timeout: 30000 });
  }
}

module.exports = { IndeedLoginPage };
