/**
 * Auth routes – register, login, me (protected).
 * node_api_kit style.
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController');
const { authenticate } = require('../../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
