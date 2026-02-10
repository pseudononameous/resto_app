/**
 * paymentRoutes.js - Payment & Billing Service
 */
const express = require('express');
const router = express.Router();
const paymentController = require('../../controller/paymentController');

router.post('/create', paymentController.add);
router.post('/list', paymentController.findAll);
router.post('/count', paymentController.getCount);
router.get('/:id', paymentController.get);
router.put('/update/:id', paymentController.update);
router.put('/partial-update/:id', paymentController.partialUpdate);
router.post('/addBulk', paymentController.bulkInsert);
router.delete('/delete/:id', paymentController.deleteRecord);
router.post('/deleteMany', paymentController.deleteMany);

module.exports = router;
