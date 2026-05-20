# Naukri Profile Update via Native Playwright

## Project Overview

This repository contains an automation project that updates a Naukri.com profile using Playwright (native browser automation). The scripts are written to log in, navigate to the profile sections, update relevant fields (contact info, experience, skills, resume upload), and verify changes.

## Features

- Automated login with secure credential handling
- Update profile sections: personal details, experience, education, skills
- Resume upload support
- Form validation and post-update verification
- Configurable selectors and timeouts for robustness

## Prerequisites

- Node.js (16+ recommended) or the runtime used by Playwright
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

  - NAUKRI_EMAIL
  - NAUKRI_PASSWORD
  - PROFILE_DATA_PATH (optional JSON with profile fields)

- Adjust timeouts and selectors in the config file if the site structure changes.

## Usage

- Run the main script (example):

  npm run update-profile

- For headless or headed runs, toggle the Playwright launch options in the script.

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
