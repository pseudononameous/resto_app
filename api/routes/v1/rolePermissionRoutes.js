/**
 * rolePermissionRoutes.js - Identity & Access Service
 */
const express = require('express');
const router = express.Router();
const rolePermissionController = require('../../controller/rolePermissionController');

router.post('/create', rolePermissionController.add);
router.post('/list', rolePermissionController.findAll);
router.post('/count', rolePermissionController.getCount);
router.get('/:id', rolePermissionController.get);
router.put('/update/:id', rolePermissionController.update);
router.put('/partial-update/:id', rolePermissionController.partialUpdate);
router.post('/addBulk', rolePermissionController.bulkInsert);
router.delete('/delete/:id', rolePermissionController.deleteRecord);
router.post('/deleteMany', rolePermissionController.deleteMany);

module.exports = router;
