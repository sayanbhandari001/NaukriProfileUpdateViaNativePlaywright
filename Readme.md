# Naukri Profile Update via Native Playwright

## Project Overview

This repository contains an automation project that updates a Naukri.com profile using Playwright (native browser automation). The scripts are written to log in, navigate to the profile sections, update relevant fields (contact info, experience, skills, resume upload), and verify changes.

## Features

- Automated login with secure credential handling
- Update profile sections: personal details, experience, education, skills
- Resume upload support
- Form validation and post-update verification
- Configurable selectors and timeouts for robustness

## Automated cloud schedule

`.github/workflows/playwright-naukri-gulf.yml` runs on GitHub-hosted Ubuntu 24.04.
Your local computer can remain off; no VM, proxy, VPN, or Indian IP is required by
the workflow. Browser and process timezone are set to `Asia/Kolkata`.

| Days | India time (IST) | Workflow time (UTC) |
| --- | --- | --- |
| Monday-Saturday | 10:30 AM | 05:00 |
| Monday-Saturday | 12:30 PM | 07:00 |
| Monday-Saturday | 3:30 PM | 10:00 |

The cron expression is `0 5,7,10 * * 1-6`. Scheduled workflows use the default
branch (`master`). GitHub may delay or drop scheduled jobs under high load, so
these are target times rather than an exact-time guarantee. A manual run is also
available in Actions under **Profile Update (GitHub-hosted, IST schedule)**.

The workflow runs `npm ci`, validates credential availability, installs Chromium
and Linux dependencies, then runs `xvfb-run --auto-servernum npm run test:ci`.
The two regional projects cover each test once, with two workers and one retry.
All profile workflows share a concurrency group to prevent overlapping updates.
The self-hosted workflow remains a manual fallback with no schedule.

Configure these repository Actions secrets (passwords are **base64-encoded** to
match the existing test helpers; base64 is not encryption):

- `NAUKRI_USER_1_EMAIL` / `NAUKRI_USER_1_PASSWORD`
- `NAUKRI_USER_2_EMAIL` / `NAUKRI_USER_2_PASSWORD`
- `NAUKRI_USER_3_EMAIL` / `NAUKRI_USER_3_PASSWORD`
- `GULF_NAUKRI_EMAIL` / `GULF_NAUKRI_PASSWORD`
- `BAYT_EMAIL` / `BAYT_PASSWORD`
- `FOUNDIT_EMAIL` / `FOUNDIT_PASSWORD`
- `GULFTALENT_EMAIL` / `GULFTALENT_PASSWORD`

Indeed and Foundit Gulf remain optional: set both `INDEED_EMAIL` and
`INDEED_PASSWORD`, or both `FOUNDIT_GULF_EMAIL` and `FOUNDIT_GULF_PASSWORD`, to
enable them. The wife account remains disabled. Missing required credentials or
incomplete optional pairs fail the workflow instead of hiding a configuration
error. Portal failures also fail the run; CAPTCHA, login challenges, and session
rejection may still prevent unattended success on cloud runners.

Reports and failure artifacts are retained for seven days and can contain profile
information. Review repository access before enabling additional accounts.
To roll back hosting, remove this workflow's schedule and restore the same cron
under the self-hosted workflow once a local runner is available.

## Prerequisites

- Node.js 22 (used by CI)
- npm or yarn
- Playwright (installed as a dependency)
- A valid Naukri account for testing

## Installation

1. Clone the repository:

	git clone <repo-url>

2. Change into the project directory:

	cd NaukriProfileUpdateViaNativePlaywright

3. Install dependencies:

	npm install

4. Install Playwright browsers (if not installed automatically):

	npx playwright install

## Configuration

- Create a .env or config file (not checked into source control) with credentials and options:

  - Use the credential variable names listed under Automated cloud schedule.

- Adjust timeouts and selectors in the config file if the site structure changes.

## Usage

### Run everything

Every spec carries both a region tag (`@india` / `@international`) and a priority tag
(`@priority-1` ... `@priority-7`), and `playwright.config.js` defines a project for each.
A bare `npx playwright test` therefore runs each test **twice** — once under its region
project and once under its priority project.

To run all portals exactly once, in priority order, use the dependency chain:

```powershell
npx playwright test --project=priority-7
```

`priority-7` depends on `priority-6`, which depends on `priority-5`, and so on, so
Playwright pulls in every project and executes them sequentially:

gulf -> naukri -> wife -> bayt -> foundit -> gulftalent -> indeed

### Other useful commands

```powershell
npx playwright test --project=priority-7 --headed          # watch the run (headed is the default)
$env:HEADLESS="true"; npx playwright test --project=priority-7   # headless run
npx playwright test --project=india                        # India portals only
npx playwright test --project=international                # international portals only
npx playwright test tests/indeed.spec.js                   # a single spec
npx playwright show-report                                 # open the HTML report
```

Runs are headed by default because the job portals block headless browsers
("Access Denied"); set `HEADLESS=true` to opt in to headless. CI supplies a virtual
display via `xvfb-run`.

## Project Structure

- /src - automation scripts and helpers
- /config - configuration and environment templates
- /tests - any test cases or validation scripts
- /data - example profile data and resumes (keep sensitive data out of repo)
- Readme.md - this file

## Best Practices

- Keep credentials out of the repository; use environment variables or secret stores.
- Add retries and waits for network/DOM stability.
- Use feature flags when rolling out large changes.

## Troubleshooting

- If selectors fail, re-open the site in a browser and update selectors.
- For authentication issues, verify credentials and any CAPTCHA / 2FA on the account.

## Contributing

- Open an issue for bugs or feature requests.
- Fork the repository, make changes on a branch, and submit a pull request.

## License

Specify a license (e.g., MIT) in a LICENSE file.

## Notes

- This project interacts with a third-party site. Ensure compliance with Naukri's terms of service and avoid abusive or high-frequency automated requests.

```
