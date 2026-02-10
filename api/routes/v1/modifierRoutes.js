/**
 * modifierRoutes.js - Product Catalog Service
 */
const express = require('express');
const router = express.Router();
const modifierController = require('../../controller/modifierController');

router.post('/create', modifierController.add);
router.post('/list', modifierController.findAll);
router.post('/count', modifierController.getCount);
router.get('/:id', modifierController.get);
router.put('/update/:id', modifierController.update);
router.put('/partial-update/:id', modifierController.partialUpdate);
router.post('/addBulk', modifierController.bulkInsert);
router.delete('/delete/:id', modifierController.deleteRecord);
router.post('/deleteMany', modifierController.deleteMany);

module.exports = router;
