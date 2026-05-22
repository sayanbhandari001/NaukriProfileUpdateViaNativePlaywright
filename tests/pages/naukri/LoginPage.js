class NaukriLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#usernameField');
    this.passwordField = page.locator('input#passwordField');
    this.loginButton = page.locator('button:has-text("Login")').first();
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
  }
}

module.exports = { NaukriLoginPage };
