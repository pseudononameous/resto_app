/**
 * promotionRoutes.js - Promotions & Offers Service
 */
const express = require('express');
const router = express.Router();
const promotionController = require('../../controller/promotionController');

router.post('/create', promotionController.add);
router.post('/list', promotionController.findAll);
router.post('/count', promotionController.getCount);
router.get('/:id', promotionController.get);
router.put('/update/:id', promotionController.update);
router.put('/partial-update/:id', promotionController.partialUpdate);
router.post('/addBulk', promotionController.bulkInsert);
router.delete('/delete/:id', promotionController.deleteRecord);
router.post('/deleteMany', promotionController.deleteMany);

module.exports = router;
