/**
 * categoryRoutes.js - Product Catalog Service
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/categoryController');

router.post('/create', categoryController.add);
router.post('/list', categoryController.findAll);
router.post('/count', categoryController.getCount);
router.get('/:id', categoryController.get);
router.put('/update/:id', categoryController.update);
router.put('/partial-update/:id', categoryController.partialUpdate);
router.post('/addBulk', categoryController.bulkInsert);
router.delete('/delete/:id', categoryController.deleteRecord);
router.post('/deleteMany', categoryController.deleteMany);

module.exports = router;
