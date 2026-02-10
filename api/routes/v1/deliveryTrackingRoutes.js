/**
 * deliveryTrackingRoutes.js - Delivery Management Service
 */
const express = require('express');
const router = express.Router();
const deliveryTrackingController = require('../../controller/deliveryTrackingController');

router.post('/create', deliveryTrackingController.add);
router.post('/list', deliveryTrackingController.findAll);
router.post('/count', deliveryTrackingController.getCount);
router.get('/:id', deliveryTrackingController.get);
router.put('/update/:id', deliveryTrackingController.update);
router.put('/partial-update/:id', deliveryTrackingController.partialUpdate);
router.post('/addBulk', deliveryTrackingController.bulkInsert);
router.delete('/delete/:id', deliveryTrackingController.deleteRecord);
router.post('/deleteMany', deliveryTrackingController.deleteMany);

module.exports = router;
