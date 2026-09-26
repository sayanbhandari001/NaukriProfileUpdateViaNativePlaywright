// Repository passwords are base64-encoded. Also mask the decoded values in CI logs.
if (process.env.GITHUB_ACTIONS === 'true') {
  for (const [name, value] of Object.entries(process.env)) {
    if (!name.endsWith('_PASSWORD') || !value) continue;
    const decoded = Buffer.from(value, 'base64').toString('utf8');
    if (!decoded) continue;
    const escaped = decoded.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    process.stdout.write(`::add-mask::${escaped}\n`);
  }
}
