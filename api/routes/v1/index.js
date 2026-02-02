const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const shopifyRoutes = require('./shopifyRoutes');
const authRoutes = require('./authRoutes');

router.use(healthRoutes);
router.use('/shopify', shopifyRoutes);
router.use('/auth', authRoutes);

module.exports = router;
