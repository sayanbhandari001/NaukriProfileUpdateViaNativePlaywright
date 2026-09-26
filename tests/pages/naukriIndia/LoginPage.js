class NaukriLoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('input#usernameField');
    this.passwordField = page.locator('input#passwordField');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorBanner = page.locator('.erL-txt, .server-err, [class*="error"]').filter({ hasText: /invalid|incorrect|check the email/i });
    this.serviceError = page.getByText('Something went wrong. Please try again.', { exact: true });
  }

  async goto() {
    // Keep login and profile navigation on the same origin.
    await this.page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    const loginStatuses = [];
    const recordLoginStatus = response => {
      const url = new URL(response.url());
      if ((url.hostname === 'naukri.com' || url.hostname.endsWith('.naukri.com')) &&
          /login|auth/i.test(url.pathname) &&
          ['xhr', 'fetch'].includes(response.request().resourceType())) {
        // Record status codes only: never headers, request bodies, or auth tokens.
        loginStatuses.push(response.status());
      }
    };
    await this.goto();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    this.page.on('response', recordLoginStatus);
    try {
      await this.loginButton.click();
      await this.page.waitForURL(url => url.origin === 'https://www.naukri.com' &&
        url.pathname.startsWith('/mnjuser/'), { timeout: 30000, waitUntil: 'domcontentloaded' });
      await this.emailField.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (cause) {
      const credentialsRejected = await this.errorBanner.first().isVisible();
      const serviceRejected = await this.serviceError.isVisible();
      // Do not leave credentials in the failed page's screenshots or diagnostics.
      await this.passwordField.fill('', { timeout: 1000 }).catch(() => {});
      await this.emailField.fill('', { timeout: 1000 }).catch(() => {});
      if (credentialsRejected) {
        throw new Error('Naukri rejected the login credentials.', { cause });
      }
      if (serviceRejected) {
        throw new Error(`Naukri returned "Something went wrong. Please try again." during login; an authenticated session was not created. Login response status codes: ${loginStatuses.join(', ') || 'none observed'}.`, { cause });
      }
      throw new Error(`Naukri login did not establish an authenticated session. Login response status codes: ${loginStatuses.join(', ') || 'none observed'}. Check the failure screenshot for a login or verification prompt.`, { cause });
    } finally {
      this.page.off('response', recordLoginStatus);
    }
  }
}

module.exports = { NaukriLoginPage };
