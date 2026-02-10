/**
 * deliveryRoutes.js - Delivery Management Service
 */
const express = require('express');
const router = express.Router();
const deliveryController = require('../../controller/deliveryController');

router.post('/create', deliveryController.add);
router.post('/list', deliveryController.findAll);
router.post('/count', deliveryController.getCount);
router.get('/:id', deliveryController.get);
router.put('/update/:id', deliveryController.update);
router.put('/partial-update/:id', deliveryController.partialUpdate);
router.post('/addBulk', deliveryController.bulkInsert);
router.delete('/delete/:id', deliveryController.deleteRecord);
router.post('/deleteMany', deliveryController.deleteMany);

module.exports = router;
