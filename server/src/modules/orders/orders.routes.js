const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/checkout', ordersController.checkout);
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);

module.exports = router;
