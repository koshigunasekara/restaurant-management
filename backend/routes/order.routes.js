const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { isAuth, isAdmin } = require('../middleware/auth');

// Validation middleware for orders
const orderValidation = [
    check('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    check('items.*.menuItem')
        .notEmpty()
        .withMessage('Menu item ID is required'),
    check('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    check('orderType')
        .isIn(['dine-in', 'takeaway', 'delivery'])
        .withMessage('Invalid order type'),
    check('deliveryAddress')
        .if(check('orderType').equals('delivery'))
        .notEmpty()
        .withMessage('Delivery address is required for delivery orders'),
    check('tableNumber')
        .if(check('orderType').equals('dine-in'))
        .notEmpty()
        .withMessage('Table number is required for dine-in orders'),
    check('paymentMethod')
        .isIn(['cash', 'card', 'online'])
        .withMessage('Invalid payment method')
];

// Protected routes (require authentication)
router.post('/', isAuth, orderValidation, orderController.createOrder);
router.get('/my-orders', isAuth, orderController.getUserOrders);
router.get('/:id', isAuth, orderController.getOrderById);
router.post('/:id/cancel', isAuth, orderController.cancelOrder);

// Admin only routes
router.get('/', isAdmin, orderController.getAllOrders);
router.put('/:id/status', isAdmin, orderController.updateOrderStatus);
router.put('/:id/payment', isAdmin, orderController.updatePaymentStatus);

module.exports = router; 