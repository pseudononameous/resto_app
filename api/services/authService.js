/**
 * Auth service – register, login, user lookup.
 * Uses JSON file store (node_api_kit style, no DB).
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const authConfig = require('../config/auth');

const USERS_FILE = path.join(__dirname, '../data/users.json');

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users) {
  const dir = path.dirname(USERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} name - optional display name
 * @returns {{ user, token } | { error, status }}
 */
async function register(email, password, name = '') {
  const trimmedEmail = (email || '').toString().trim().toLowerCase();
  const trimmedName = (name || '').toString().trim();

  if (!trimmedEmail || !password) {
    return { error: 'Email and password are required', status: 400 };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters', status: 400 };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { error: 'Invalid email format', status: 400 };
  }

  const users = await readUsers();
  const exists = users.find((u) => u.email === trimmedEmail);
  if (exists) {
    return { error: 'Email already registered', status: 409 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: String(Date.now()),
    email: trimmedEmail,
    name: trimmedName || trimmedEmail.split('@')[0],
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );

  const { passwordHash, ...safeUser } = user;
  return { user: safeUser, token };
}

/**
 * Login user by email/password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user, token } | { error, status }}
 */
async function login(email, password) {
  const trimmedEmail = (email || '').toString().trim().toLowerCase();
  if (!trimmedEmail || !password) {
    return { error: 'Email and password are required', status: 400 };
  }

  const users = await readUsers();
  const user = users.find((u) => u.email === trimmedEmail);
  if (!user) {
    return { error: 'Invalid email or password', status: 401 };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: 'Invalid email or password', status: 401 };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );

  const { passwordHash, ...safeUser } = user;
  return { user: safeUser, token };
}

/**
 * Get user by ID (for protected routes).
 * @param {string} userId
 * @returns {object|null}
 */
async function getUserById(userId) {
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Verify JWT and return payload or null.
 * @param {string} token
 * @returns {{ userId, email } | null}
 */
function verifyToken(token) {
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret);
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

module.exports = {
  register,
  login,
  getUserById,
  verifyToken,
};
