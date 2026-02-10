/**
 * notificationRoutes.js - Notification Service
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../../controller/notificationController');

router.post('/create', notificationController.add);
router.post('/list', notificationController.findAll);
router.post('/count', notificationController.getCount);
router.get('/:id', notificationController.get);
router.put('/update/:id', notificationController.update);
router.put('/partial-update/:id', notificationController.partialUpdate);
router.post('/addBulk', notificationController.bulkInsert);
router.delete('/delete/:id', notificationController.deleteRecord);
router.post('/deleteMany', notificationController.deleteMany);

module.exports = router;
