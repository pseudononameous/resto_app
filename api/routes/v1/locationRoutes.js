const express = require('express');
const router = express.Router();
const locationController = require('../../controller/locationController');

router.post('/create', locationController.add);
router.post('/list', locationController.findAll);
router.post('/count', locationController.getCount);
router.get('/:id', locationController.get);
router.put('/update/:id', locationController.update);
router.put('/partial-update/:id', locationController.partialUpdate);
router.post('/addBulk', locationController.bulkInsert);
router.delete('/delete/:id', locationController.deleteRecord);
router.post('/deleteMany', locationController.deleteMany);

module.exports = router;
