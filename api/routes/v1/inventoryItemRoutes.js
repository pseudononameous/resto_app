/**
 * inventoryItemRoutes.js - Inventory Service
 */
const express = require('express');
const router = express.Router();
const inventoryItemController = require('../../controller/inventoryItemController');

router.post('/create', inventoryItemController.add);
router.post('/list', inventoryItemController.findAll);
router.post('/count', inventoryItemController.getCount);
router.get('/:id', inventoryItemController.get);
router.put('/update/:id', inventoryItemController.update);
router.put('/partial-update/:id', inventoryItemController.partialUpdate);
router.post('/addBulk', inventoryItemController.bulkInsert);
router.delete('/delete/:id', inventoryItemController.deleteRecord);
router.post('/deleteMany', inventoryItemController.deleteMany);

module.exports = router;
