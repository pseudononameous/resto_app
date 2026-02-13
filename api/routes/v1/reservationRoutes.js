const express = require('express');
const router = express.Router();
const reservationController = require('../../controller/reservationController');

router.post('/create', reservationController.add);
router.post('/list', reservationController.findAll);
router.post('/count', reservationController.getCount);
router.get('/:id', reservationController.get);
router.put('/update/:id', reservationController.update);
router.put('/partial-update/:id', reservationController.partialUpdate);
router.post('/addBulk', reservationController.bulkInsert);
router.delete('/delete/:id', reservationController.deleteRecord);
router.post('/deleteMany', reservationController.deleteMany);

module.exports = router;
