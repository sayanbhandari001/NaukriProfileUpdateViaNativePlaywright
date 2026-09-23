class NaukriLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#usernameField');
    this.passwordField = page.locator('input#passwordField');
    this.loginButton = page.locator('button:has-text("Login")').first();
    this.errorBanner = page.locator('.erL-txt, .server-err, [class*="error"]').filter({ hasText: /invalid|incorrect|check the email/i });
  }

  async goto() {
    await this.page.goto('https://login.naukri.com/nLogin/Login.php', { waitUntil: 'networkidle' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await Promise.all([
      this.page.waitForSelector('input#usernameField', { state: 'detached' }),
      this.loginButton.click(),
    ]);
    // The field also detaches when Naukri bounces back to the login page, so confirm
    // we actually landed on an authenticated page before going on.
    if (await this.errorBanner.first().isVisible().catch(() => false)) {
      throw new Error('Naukri rejected the credentials: ' + (await this.errorBanner.first().innerText()).trim());
    }
    await this.page.waitForURL((url) => !url.host.startsWith('login.'), { timeout: 30000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

module.exports = { NaukriLoginPage };
