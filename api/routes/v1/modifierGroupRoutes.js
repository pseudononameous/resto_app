/**
 * modifierGroupRoutes.js - Product Catalog Service
 */
const express = require('express');
const router = express.Router();
const modifierGroupController = require('../../controller/modifierGroupController');

router.post('/create', modifierGroupController.add);
router.post('/list', modifierGroupController.findAll);
router.post('/count', modifierGroupController.getCount);
router.get('/:id', modifierGroupController.get);
router.put('/update/:id', modifierGroupController.update);
router.put('/partial-update/:id', modifierGroupController.partialUpdate);
router.post('/addBulk', modifierGroupController.bulkInsert);
router.delete('/delete/:id', modifierGroupController.deleteRecord);
router.post('/deleteMany', modifierGroupController.deleteMany);

module.exports = router;
