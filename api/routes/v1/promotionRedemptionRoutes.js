/**
 * promotionRedemptionRoutes.js - Promotions & Offers Service
 */
const express = require('express');
const router = express.Router();
const promotionRedemptionController = require('../../controller/promotionRedemptionController');

router.post('/create', promotionRedemptionController.add);
router.post('/list', promotionRedemptionController.findAll);
router.post('/count', promotionRedemptionController.getCount);
router.get('/:id', promotionRedemptionController.get);
router.put('/update/:id', promotionRedemptionController.update);
router.put('/partial-update/:id', promotionRedemptionController.partialUpdate);
router.post('/addBulk', promotionRedemptionController.bulkInsert);
router.delete('/delete/:id', promotionRedemptionController.deleteRecord);
router.post('/deleteMany', promotionRedemptionController.deleteMany);

module.exports = router;
