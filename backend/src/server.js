const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  tlsAllowInvalidHostnames: false,
  tlsAllowInvalidCertificates: false,
  authSource: 'admin'
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Hide sensitive information in logs
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /(mongodb\+srv:\/\/)([^:]+):([^@]+)@/,
      '$1$2:****@'
    );
    console.log('MongoDB URI:', sanitizedUri);
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    if (error.message.includes('IP whitelist')) {
      console.error('\nIMPORTANT: You need to whitelist your IP address in MongoDB Atlas:');
      console.error('1. Go to MongoDB Atlas dashboard');
      console.error('2. Click on "Network Access" in the left sidebar');
      console.error('3. Click "Add IP Address"');
      console.error('4. Click "Allow Access from Anywhere" or add your specific IP\n');
    }

    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing Mongoose connection:', err);
    process.exit(1);
  }
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Test route to check MongoDB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    res.json({
      status: 'success',
      message: 'Database connection test',
      state: states[dbState],
      connected: dbState === 1
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Restaurant Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  console.error('Error stack:', err.stack);
  
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
}); 