/**
 * menuRoutes.js - Menu Service
 */
const express = require('express');
const router = express.Router();
const menuController = require('../../controller/menuController');

router.post('/create', menuController.add);
router.post('/list', menuController.findAll);
router.post('/count', menuController.getCount);
router.get('/:id', menuController.get);
router.put('/update/:id', menuController.update);
router.put('/partial-update/:id', menuController.partialUpdate);
router.post('/addBulk', menuController.bulkInsert);
router.delete('/delete/:id', menuController.deleteRecord);
router.post('/deleteMany', menuController.deleteMany);

module.exports = router;
