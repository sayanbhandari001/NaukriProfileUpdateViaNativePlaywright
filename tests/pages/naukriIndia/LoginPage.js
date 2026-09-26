class NaukriLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#usernameField');
    this.passwordField = page.locator('input#passwordField');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorBanner = page.locator('.erL-txt, .server-err, [class*="error"]').filter({ hasText: /invalid|incorrect|check the email/i });
  }

  async goto() {
    // Keep login and profile navigation on the same origin.
    await this.page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    try {
      await this.page.waitForURL(url => url.origin === 'https://www.naukri.com' &&
        url.pathname.startsWith('/mnjuser/'), { timeout: 30000, waitUntil: 'domcontentloaded' });
      await this.emailField.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (cause) {
      if (await this.errorBanner.first().isVisible()) {
        throw new Error('Naukri rejected the login credentials.', { cause });
      }
      throw new Error('Naukri login did not establish an authenticated session; check the failure screenshot for a login or verification prompt.', { cause });
    }
  }
}

module.exports = { NaukriLoginPage };
