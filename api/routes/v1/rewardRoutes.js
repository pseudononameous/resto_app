/**
 * rewardRoutes.js - Loyalty & Rewards Service
 */
const express = require('express');
const router = express.Router();
const rewardController = require('../../controller/rewardController');

router.post('/create', rewardController.add);
router.post('/list', rewardController.findAll);
router.post('/count', rewardController.getCount);
router.get('/:id', rewardController.get);
router.put('/update/:id', rewardController.update);
router.put('/partial-update/:id', rewardController.partialUpdate);
router.post('/addBulk', rewardController.bulkInsert);
router.delete('/delete/:id', rewardController.deleteRecord);
router.post('/deleteMany', rewardController.deleteMany);

module.exports = router;
