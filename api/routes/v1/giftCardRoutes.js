/**
 * giftCardRoutes.js - Gift Card Service
 */
const express = require('express');
const router = express.Router();
const giftCardController = require('../../controller/giftCardController');

router.post('/create', giftCardController.add);
router.post('/list', giftCardController.findAll);
router.post('/count', giftCardController.getCount);
router.get('/:id', giftCardController.get);
router.put('/update/:id', giftCardController.update);
router.put('/partial-update/:id', giftCardController.partialUpdate);
router.post('/addBulk', giftCardController.bulkInsert);
router.delete('/delete/:id', giftCardController.deleteRecord);
router.post('/deleteMany', giftCardController.deleteMany);

module.exports = router;
