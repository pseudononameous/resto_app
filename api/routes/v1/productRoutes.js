/**
 * productRoutes.js - Product Catalog Service
 */
const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');

router.post('/create', productController.add);
router.post('/list', productController.findAll);
router.post('/count', productController.getCount);
router.get('/:id', productController.get);
router.put('/update/:id', productController.update);
router.put('/partial-update/:id', productController.partialUpdate);
router.post('/addBulk', productController.bulkInsert);
router.delete('/delete/:id', productController.deleteRecord);
router.post('/deleteMany', productController.deleteMany);

module.exports = router;
