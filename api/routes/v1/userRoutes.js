/**
 * userRoutes.js - Identity & Access Service
 */
const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');

router.post('/create', userController.add);
router.post('/list', userController.findAll);
router.post('/count', userController.getCount);
router.get('/:id', userController.get);
router.put('/update/:id', userController.update);
router.put('/partial-update/:id', userController.partialUpdate);
router.post('/addBulk', userController.bulkInsert);
router.delete('/delete/:id', userController.deleteRecord);
router.post('/deleteMany', userController.deleteMany);

module.exports = router;
