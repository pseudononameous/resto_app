/**
 * orderRoutes.js - Ordering Service
 */
const express = require('express');
const router = express.Router();
const orderController = require('../../controller/orderController');

router.post('/create', orderController.add);
router.post('/list', orderController.findAll);
router.post('/count', orderController.getCount);
router.get('/:id', orderController.get);
router.put('/update/:id', orderController.update);
router.put('/partial-update/:id', orderController.partialUpdate);
router.post('/addBulk', orderController.bulkInsert);
router.delete('/delete/:id', orderController.deleteRecord);
router.post('/deleteMany', orderController.deleteMany);

module.exports = router;
