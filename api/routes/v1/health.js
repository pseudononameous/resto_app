const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'resto_app_api' });
});

module.exports = router;
