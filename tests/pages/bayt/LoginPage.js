class BaytLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#LoginForm_username');
    this.passwordField = page.locator('input#LoginForm_password');
    this.loginButton = page.locator('button[type="submit"]').first();
  }

  async goto() {
    await this.page.goto('https://www.bayt.com/en/login/', { waitUntil: 'networkidle' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await Promise.all([
      this.page.waitForSelector('input#LoginForm_username', { state: 'detached' }),
      this.loginButton.click(),
    ]);
  }
}

module.exports = { BaytLoginPage };
