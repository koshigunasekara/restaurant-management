const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true
    },
    specialInstructions: {
        type: String,
        trim: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    deliveryInstructions: {
        type: String,
        trim: true
    },
    estimatedDeliveryTime: {
        type: Date
    },
    actualDeliveryTime: {
        type: Date
    },
    orderType: {
        type: String,
        enum: ['dine-in', 'takeaway', 'delivery'],
        required: true
    },
    tableNumber: {
        type: Number,
        min: 1
    },
    specialRequests: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    this.updatedAt = Date.now();
    next();
});

// Update estimated delivery time based on order type and items
orderSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('items') || this.isModified('orderType')) {
        const maxPrepTime = Math.max(...this.items.map(item => item.menuItem.preparationTime || 0));
        const baseTime = new Date();
        
        switch (this.orderType) {
            case 'delivery':
                baseTime.setMinutes(baseTime.getMinutes() + maxPrepTime + 30); // Add 30 mins for delivery
                break;
            case 'takeaway':
                baseTime.setMinutes(baseTime.getMinutes() + maxPrepTime + 10); // Add 10 mins for packaging
                break;
            case 'dine-in':
                baseTime.setMinutes(baseTime.getMinutes() + maxPrepTime + 5); // Add 5 mins for serving
                break;
        }
        
        this.estimatedDeliveryTime = baseTime;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 