const MenuItem = require('../models/menu.model');
const { validationResult } = require('express-validator');

// Get all menu items
exports.getAllItems = async (req, res) => {
    try {
        const { category, dietary, spicyLevel, available } = req.query;
        let query = {};

        // Apply filters if provided
        if (category) {
            query.category = category.toLowerCase();
        }
        if (dietary) {
            query.dietaryInfo = { $in: [dietary] };
        }
        if (spicyLevel) {
            query.spicyLevel = spicyLevel;
        }
        if (available === 'true') {
            query.isAvailable = true;
        }

        const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        console.error('Error in getAllItems:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get menu item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error in getItemById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new menu item (Admin only)
exports.createItem = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            description,
            price,
            category,
            preparationTime,
            spicyLevel,
            dietaryInfo,
            image
        } = req.body;

        // Check if item with same name exists
        const existingItem = await MenuItem.findOne({ name: name.toLowerCase() });
        if (existingItem) {
            return res.status(400).json({ message: 'Menu item with this name already exists' });
        }

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            preparationTime,
            spicyLevel,
            dietaryInfo,
            image
        });

        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        console.error('Error in createItem:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update menu item (Admin only)
exports.updateItem = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            description,
            price,
            category,
            preparationTime,
            spicyLevel,
            dietaryInfo,
            isAvailable,
            image
        } = req.body;

        // Check if item exists
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Check if new name conflicts with existing items
        if (name && name !== menuItem.name) {
            const existingItem = await MenuItem.findOne({
                name: name.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingItem) {
                return res.status(400).json({ message: 'Menu item with this name already exists' });
            }
        }

        // Update fields
        if (name) menuItem.name = name;
        if (description) menuItem.description = description;
        if (price) menuItem.price = price;
        if (category) menuItem.category = category;
        if (preparationTime) menuItem.preparationTime = preparationTime;
        if (spicyLevel) menuItem.spicyLevel = spicyLevel;
        if (dietaryInfo) menuItem.dietaryInfo = dietaryInfo;
        if (typeof isAvailable === 'boolean') menuItem.isAvailable = isAvailable;
        if (image) menuItem.image = image;

        await menuItem.save();
        res.json(menuItem);
    } catch (error) {
        console.error('Error in updateItem:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete menu item (Admin only)
exports.deleteItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        await menuItem.remove();
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error in deleteItem:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get menu items by category
exports.getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await MenuItem.find({
            category: category.toLowerCase(),
            isAvailable: true
        }).sort({ name: 1 });
        
        res.json(items);
    } catch (error) {
        console.error('Error in getItemsByCategory:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 