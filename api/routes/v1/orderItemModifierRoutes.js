/**
 * orderItemModifierRoutes.js - Ordering Service
 */
const express = require('express');
const router = express.Router();
const orderItemModifierController = require('../../controller/orderItemModifierController');

router.post('/create', orderItemModifierController.add);
router.post('/list', orderItemModifierController.findAll);
router.post('/count', orderItemModifierController.getCount);
router.get('/:id', orderItemModifierController.get);
router.put('/update/:id', orderItemModifierController.update);
router.put('/partial-update/:id', orderItemModifierController.partialUpdate);
router.post('/addBulk', orderItemModifierController.bulkInsert);
router.delete('/delete/:id', orderItemModifierController.deleteRecord);
router.post('/deleteMany', orderItemModifierController.deleteMany);

module.exports = router;
