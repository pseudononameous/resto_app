/**
 * pointsTransactionRoutes.js - Loyalty & Rewards Service
 */
const express = require('express');
const router = express.Router();
const pointsTransactionController = require('../../controller/pointsTransactionController');

router.post('/create', pointsTransactionController.add);
router.post('/list', pointsTransactionController.findAll);
router.post('/count', pointsTransactionController.getCount);
router.get('/:id', pointsTransactionController.get);
router.put('/update/:id', pointsTransactionController.update);
router.put('/partial-update/:id', pointsTransactionController.partialUpdate);
router.post('/addBulk', pointsTransactionController.bulkInsert);
router.delete('/delete/:id', pointsTransactionController.deleteRecord);
router.post('/deleteMany', pointsTransactionController.deleteMany);

module.exports = router;
