const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { ...req.body, password: '****' });

    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Create new user
    console.log('Creating new user with email:', email);
    const user = new User({
      name,
      email,
      password,
      role: role || 'customer'
    });

    // Save user to database
    console.log('Attempting to save user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    // Generate token
    const token = generateToken(savedUser);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({
        message: 'Database error',
        error: 'There was a problem connecting to the database'
      });
    }

    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check if role matches
    if (role && user.role !== role) {
      console.log('Invalid role for user:', email);
      return res.status(401).json({
        message: 'Invalid role for this account'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    console.log('Successful login for user:', email);

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
}; 