/**
 * refundRoutes.js - Payment & Billing Service
 */
const express = require('express');
const router = express.Router();
const refundController = require('../../controller/refundController');

router.post('/create', refundController.add);
router.post('/list', refundController.findAll);
router.post('/count', refundController.getCount);
router.get('/:id', refundController.get);
router.put('/update/:id', refundController.update);
router.put('/partial-update/:id', refundController.partialUpdate);
router.post('/addBulk', refundController.bulkInsert);
router.delete('/delete/:id', refundController.deleteRecord);
router.post('/deleteMany', refundController.deleteMany);

module.exports = router;
