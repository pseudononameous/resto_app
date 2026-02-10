/**
 * menuItemRoutes.js - Menu Service
 */
const express = require('express');
const router = express.Router();
const menuItemController = require('../../controller/menuItemController');

router.post('/create', menuItemController.add);
router.post('/list', menuItemController.findAll);
router.post('/count', menuItemController.getCount);
router.get('/:id', menuItemController.get);
router.put('/update/:id', menuItemController.update);
router.put('/partial-update/:id', menuItemController.partialUpdate);
router.post('/addBulk', menuItemController.bulkInsert);
router.delete('/delete/:id', menuItemController.deleteRecord);
router.post('/deleteMany', menuItemController.deleteMany);

module.exports = router;
