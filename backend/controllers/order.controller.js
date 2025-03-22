const Order = require('../models/order.model');
const MenuItem = require('../models/menu.model');
const { validationResult } = require('express-validator');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            items,
            orderType,
            deliveryAddress,
            deliveryInstructions,
            tableNumber,
            specialRequests,
            paymentMethod
        } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(400).json({
                    message: `Menu item with ID ${item.menuItem} not found`
                });
            }
            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    message: `Menu item ${menuItem.name} is currently unavailable`
                });
            }

            validatedItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                price: menuItem.price,
                specialInstructions: item.specialInstructions
            });

            totalAmount += menuItem.price * item.quantity;
        }

        const order = new Order({
            user: req.user.id,
            items: validatedItems,
            orderType,
            totalAmount,
            paymentMethod,
            paymentStatus: 'pending',
            status: 'received',
            deliveryAddress,
            deliveryInstructions,
            tableNumber,
            specialRequests
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, date, user } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        if (user) {
            query.user = user;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (!req.user.isAdmin && order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['received', 'preparing', 'ready', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update status and delivery time if applicable
        order.status = status;
        if (status === 'delivered') {
            order.actualDeliveryTime = new Date();
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update payment status (Admin only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const validStatuses = ['pending', 'completed', 'failed', 'refunded'];

        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = paymentStatus;
        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Error in updatePaymentStatus:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to cancel this order
        if (!req.user.isAdmin && order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (!['received', 'preparing'].includes(order.status)) {
            return res.status(400).json({
                message: 'Order cannot be cancelled at this stage'
            });
        }

        order.status = 'cancelled';
        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 