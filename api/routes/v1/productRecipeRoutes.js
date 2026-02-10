/**
 * productRecipeRoutes.js - Inventory Service
 */
const express = require('express');
const router = express.Router();
const productRecipeController = require('../../controller/productRecipeController');

router.post('/create', productRecipeController.add);
router.post('/list', productRecipeController.findAll);
router.post('/count', productRecipeController.getCount);
router.get('/:id', productRecipeController.get);
router.put('/update/:id', productRecipeController.update);
router.put('/partial-update/:id', productRecipeController.partialUpdate);
router.post('/addBulk', productRecipeController.bulkInsert);
router.delete('/delete/:id', productRecipeController.deleteRecord);
router.post('/deleteMany', productRecipeController.deleteMany);

module.exports = router;
