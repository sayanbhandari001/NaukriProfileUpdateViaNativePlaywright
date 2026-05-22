class GulfLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#loginPageLoginEmail');
    this.passwordField = page.locator('input#loginPassword');
    this.loginButton = page.locator('button:has-text("Login")').first();
  }

  async goto() {
    await this.page.goto('https://www.naukrigulf.com/jobseeker/login', { waitUntil: 'networkidle' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await Promise.all([
      this.page.waitForSelector('input#loginPageLoginEmail', { state: 'detached' }),
      this.loginButton.click(),
    ]);
  }
}

module.exports = { GulfLoginPage };
