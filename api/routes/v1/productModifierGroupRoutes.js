const express = require('express');
const router = express.Router();
const productModifierGroupController = require('../../controller/productModifierGroupController');

router.post('/create', productModifierGroupController.add);
router.post('/list', productModifierGroupController.findAll);
router.post('/count', productModifierGroupController.getCount);
router.get('/:id', productModifierGroupController.get);
router.put('/update/:id', productModifierGroupController.update);
router.put('/partial-update/:id', productModifierGroupController.partialUpdate);
router.post('/addBulk', productModifierGroupController.bulkInsert);
router.delete('/delete/:id', productModifierGroupController.deleteRecord);
router.post('/deleteMany', productModifierGroupController.deleteMany);

module.exports = router;
