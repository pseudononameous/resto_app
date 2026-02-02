/**
 * Auth middleware – verifies JWT and attaches user to request.
 * node_api_kit style.
 */

const authService = require('../services/authService');

/**
 * Extracts Bearer token from Authorization header or query.
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.query.token || null;
}

/**
 * Protect routes – requires valid JWT.
 */
async function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.unAuthorized({ message: 'No token provided' });
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    return res.unAuthorized({ message: 'Invalid or expired token' });
  }

  const user = await authService.getUserById(payload.userId);
  if (!user) {
    return res.unAuthorized({ message: 'User not found' });
  }

  req.user = user;
  req.tokenPayload = payload;
  next();
}

/**
 * Optional auth – attaches user if token present, does not require it.
 */
async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next();

  const payload = authService.verifyToken(token);
  if (!payload) return next();

  const user = await authService.getUserById(payload.userId);
  if (user) {
    req.user = user;
    req.tokenPayload = payload;
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  extractToken,
};
