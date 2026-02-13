const express = require('express');
const router = express.Router();
const customerAddressController = require('../../controller/customerAddressController');

router.post('/create', customerAddressController.add);
router.post('/list', customerAddressController.findAll);
router.post('/count', customerAddressController.getCount);
router.get('/:id', customerAddressController.get);
router.put('/update/:id', customerAddressController.update);
router.put('/partial-update/:id', customerAddressController.partialUpdate);
router.post('/addBulk', customerAddressController.bulkInsert);
router.delete('/delete/:id', customerAddressController.deleteRecord);
router.post('/deleteMany', customerAddressController.deleteMany);

module.exports = router;
