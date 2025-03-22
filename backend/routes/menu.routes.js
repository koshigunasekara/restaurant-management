const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const menuController = require('../controllers/menu.controller');
const { isAdmin } = require('../middleware/auth');

// Validation middleware for menu items
const menuItemValidation = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    check('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    check('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ min: 2, max: 30 })
        .withMessage('Category must be between 2 and 30 characters'),
    check('preparationTime')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Preparation time must be a positive integer'),
    check('spicyLevel')
        .optional()
        .isIn(['none', 'mild', 'medium', 'hot', 'extra hot'])
        .withMessage('Invalid spicy level'),
    check('dietaryInfo')
        .optional()
        .isArray()
        .withMessage('Dietary info must be an array'),
    check('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL')
];

// Public routes
router.get('/', menuController.getAllItems);
router.get('/category/:category', menuController.getItemsByCategory);
router.get('/:id', menuController.getItemById);

// Admin only routes
router.post('/', isAdmin, menuItemValidation, menuController.createItem);
router.put('/:id', isAdmin, menuItemValidation, menuController.updateItem);
router.delete('/:id', isAdmin, menuController.deleteItem);

module.exports = router; 