/**
 * orderItemRoutes.js - Ordering Service
 */
const express = require('express');
const router = express.Router();
const orderItemController = require('../../controller/orderItemController');

router.post('/create', orderItemController.add);
router.post('/list', orderItemController.findAll);
router.post('/count', orderItemController.getCount);
router.get('/:id', orderItemController.get);
router.put('/update/:id', orderItemController.update);
router.put('/partial-update/:id', orderItemController.partialUpdate);
router.post('/addBulk', orderItemController.bulkInsert);
router.delete('/delete/:id', orderItemController.deleteRecord);
router.post('/deleteMany', orderItemController.deleteMany);

module.exports = router;
