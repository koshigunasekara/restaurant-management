const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        default: 'default-food-image.jpg'
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['appetizer', 'main', 'dessert', 'beverage'],
        lowercase: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        required: [true, 'Preparation time is required'],
        min: [1, 'Preparation time must be at least 1 minute']
    },
    spicyLevel: {
        type: String,
        enum: ['mild', 'medium', 'hot', 'extra-hot'],
        default: 'mild'
    },
    dietaryInfo: [{
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nuts']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
menuItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 