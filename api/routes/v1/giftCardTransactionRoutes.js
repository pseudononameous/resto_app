/**
 * giftCardTransactionRoutes.js - Gift Card Service
 */
const express = require('express');
const router = express.Router();
const giftCardTransactionController = require('../../controller/giftCardTransactionController');

router.post('/create', giftCardTransactionController.add);
router.post('/list', giftCardTransactionController.findAll);
router.post('/count', giftCardTransactionController.getCount);
router.get('/:id', giftCardTransactionController.get);
router.put('/update/:id', giftCardTransactionController.update);
router.put('/partial-update/:id', giftCardTransactionController.partialUpdate);
router.post('/addBulk', giftCardTransactionController.bulkInsert);
router.delete('/delete/:id', giftCardTransactionController.deleteRecord);
router.post('/deleteMany', giftCardTransactionController.deleteMany);

module.exports = router;
