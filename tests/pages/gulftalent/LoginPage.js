class GulfTalentLoginPage {
  constructor(page) {
    this.page = page;
    // /login is a 404 — the login form is a modal opened from the header link
    this.headerLoginLink = page.getByRole('banner').getByRole('link', { name: 'Login', exact: true });
    this.emailField = page.locator('input[name="email"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  async goto() {
    await this.page.goto('https://www.gulftalent.com/', { waitUntil: 'domcontentloaded' });
    await this.headerLoginLink.click();
    await this.emailField.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/\/candidates\//, { timeout: 30000 });
  }
}

module.exports = { GulfTalentLoginPage };
