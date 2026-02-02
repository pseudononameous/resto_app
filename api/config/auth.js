/**
 * Auth config (from env).
 */

const jwtSecret = (process.env.JWT_SECRET || 'resto-app-dev-secret-change-in-production').trim();
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

module.exports = {
  jwtSecret,
  jwtExpiresIn,
};
