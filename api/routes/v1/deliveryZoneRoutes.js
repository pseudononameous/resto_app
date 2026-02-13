const express = require('express');
const router = express.Router();
const deliveryZoneController = require('../../controller/deliveryZoneController');

router.post('/create', deliveryZoneController.add);
router.post('/list', deliveryZoneController.findAll);
router.post('/count', deliveryZoneController.getCount);
router.get('/:id', deliveryZoneController.get);
router.put('/update/:id', deliveryZoneController.update);
router.put('/partial-update/:id', deliveryZoneController.partialUpdate);
router.post('/addBulk', deliveryZoneController.bulkInsert);
router.delete('/delete/:id', deliveryZoneController.deleteRecord);
router.post('/deleteMany', deliveryZoneController.deleteMany);

module.exports = router;
