const express = require('express');
const router = express.Router();
const holidayScheduleController = require('../../controller/holidayScheduleController');

router.post('/create', holidayScheduleController.add);
router.post('/list', holidayScheduleController.findAll);
router.post('/count', holidayScheduleController.getCount);
router.get('/:id', holidayScheduleController.get);
router.put('/update/:id', holidayScheduleController.update);
router.put('/partial-update/:id', holidayScheduleController.partialUpdate);
router.post('/addBulk', holidayScheduleController.bulkInsert);
router.delete('/delete/:id', holidayScheduleController.deleteRecord);
router.post('/deleteMany', holidayScheduleController.deleteMany);

module.exports = router;
