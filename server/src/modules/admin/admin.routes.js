const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const isAdmin = require('../../middleware/admin.middleware');
const adminController = require('./admin.controller');

router.use(auth, isAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
