class FounditLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#userName');
    this.passwordField = page.locator('input#password');
    this.loginButton = page.locator('button#loginSubmit');
  }

  async goto() {
    await this.page.goto('https://www.foundit.sg/rio/login', { waitUntil: 'domcontentloaded' });
    await this.emailField.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await Promise.all([
      this.page.waitForSelector('input#userName', { state: 'detached' }),
      this.loginButton.click(),
    ]);
  }
}

module.exports = { FounditLoginPage };
