/**
 * loyaltyAccountRoutes.js - Loyalty & Rewards Service
 */
const express = require('express');
const router = express.Router();
const loyaltyAccountController = require('../../controller/loyaltyAccountController');

router.post('/create', loyaltyAccountController.add);
router.post('/list', loyaltyAccountController.findAll);
router.post('/count', loyaltyAccountController.getCount);
router.get('/:id', loyaltyAccountController.get);
router.put('/update/:id', loyaltyAccountController.update);
router.put('/partial-update/:id', loyaltyAccountController.partialUpdate);
router.post('/addBulk', loyaltyAccountController.bulkInsert);
router.delete('/delete/:id', loyaltyAccountController.deleteRecord);
router.post('/deleteMany', loyaltyAccountController.deleteMany);

module.exports = router;
