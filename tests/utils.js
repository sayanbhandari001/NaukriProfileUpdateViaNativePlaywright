require('dotenv').config();

function requireEnvValue(name, fallback) {
  const raw = process.env[name]?.trim();
  if (raw) {
    return raw;
  }
  if (fallback !== undefined && fallback !== null) {
    return fallback;
  }
  throw new Error(`Environment variable ${name} is required and must be set.`);
}

function decodeBase64(value) {
  return Buffer.from(value, 'base64').toString('utf-8');
}

module.exports = {
  requireEnvValue,
  decodeBase64
};
