const express = require('express');
const router = express.Router();
const publicController = require('../../controller/publicController');

router.get('/menu', publicController.getMenu);
router.get('/locations', publicController.getLocations);
router.get('/delivery-zones', publicController.getDeliveryZones);
router.post('/place-order', publicController.placeOrder);
router.get('/order/:id', publicController.getOrderStatus);

module.exports = router;
