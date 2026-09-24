const FOUNDIT_SG_BASE_URL = 'https://www.foundit.sg';

class FounditLoginPage {
  constructor(page, baseUrl = FOUNDIT_SG_BASE_URL) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.emailField = page.locator('input#userName');
    this.passwordField = page.locator('input#password');
    this.loginButton = page.locator('button#loginSubmit');
  }

  async goto() {
    await this.page.goto(`${this.baseUrl}/rio/login`, { waitUntil: 'domcontentloaded' });
    await this.emailField.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });
  }
}

module.exports = { FounditLoginPage, FOUNDIT_SG_BASE_URL };
