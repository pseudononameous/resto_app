/**
 * Auth controller – register, login, me.
 * node_api_kit style: uses res.success, res.unAuthorized, etc.
 */

const authService = require('../services/authService');

async function register(req, res) {
  const { email, password, name } = req.body || {};
  const result = await authService.register(email, password, name);

  if (result.error) {
    if (result.status === 400) return res.badRequest({ message: result.error });
    if (result.status === 409) return res.validationError({ message: result.error });
    return res.internalServerError({ message: result.error });
  }

  return res.success({
    message: 'Registration successful',
    data: { user: result.user, token: result.token },
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const result = await authService.login(email, password);

  if (result.error) {
    if (result.status === 400) return res.badRequest({ message: result.error });
    if (result.status === 401) return res.unAuthorized({ message: result.error });
    return res.internalServerError({ message: result.error });
  }

  return res.success({
    message: 'Login successful',
    data: { user: result.user, token: result.token },
  });
}

async function me(req, res) {
  if (!req.user) {
    return res.unAuthorized({ message: 'Not authenticated' });
  }
  return res.success({
    message: 'User retrieved',
    data: { user: req.user },
  });
}

module.exports = {
  register,
  login,
  me,
};
