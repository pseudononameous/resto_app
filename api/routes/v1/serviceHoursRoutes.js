const express = require('express');
const router = express.Router();
const serviceHoursController = require('../../controller/serviceHoursController');

router.post('/create', serviceHoursController.add);
router.post('/list', serviceHoursController.findAll);
router.post('/count', serviceHoursController.getCount);
router.get('/:id', serviceHoursController.get);
router.put('/update/:id', serviceHoursController.update);
router.put('/partial-update/:id', serviceHoursController.partialUpdate);
router.post('/addBulk', serviceHoursController.bulkInsert);
router.delete('/delete/:id', serviceHoursController.deleteRecord);
router.post('/deleteMany', serviceHoursController.deleteMany);

module.exports = router;
