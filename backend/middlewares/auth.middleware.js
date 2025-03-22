const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Authorize roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Check ownership
exports.checkOwnership = (req, res, next) => {
    // Allow admins to access any resource
    if (req.user.role === 'admin') {
        return next();
    }

    // For regular users, check if they own the resource
    if (req.params.id !== req.user.id) {
        return res.status(403).json({
            message: 'Not authorized to access this resource'
        });
    }

    next();
}; 