// Wait for the real portal UI, allowing transient verification pages to finish.
// Persistent access challenges remain failures; they must never become skipped tests.
async function waitForPortalReady(page, readyLocator, portal, timeout = 20000) {
  try {
    await readyLocator.waitFor({ state: 'visible', timeout });
  } catch (cause) {
    const challenge = page.getByText(/Performing security verification|Verify you are human|Checking your browser/i).first();
    const denied = page.getByRole('heading', { name: 'Access Denied', exact: true });
    if (await challenge.isVisible() || await denied.isVisible()) {
      throw new Error(`${portal} blocked browser access with a security verification or access-denied page. No profile update was performed.`, { cause });
    }
    throw cause;
  }
}

module.exports = { waitForPortalReady };
