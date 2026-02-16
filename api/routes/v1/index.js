const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const shopifyRoutes = require('./shopifyRoutes');

router.use(healthRoutes);
router.use('/shopify', shopifyRoutes);

module.exports = router;
