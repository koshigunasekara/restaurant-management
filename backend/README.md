# Restaurant Management System Backend

This is the backend server for the Restaurant Management System built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── middleware/    # Custom middleware
├── models/        # Database models
├── routes/        # API routes
└── server.js      # Main application file
```

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/users - Get all users (protected)
- More endpoints coming soon...

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- cors for Cross-Origin Resource Sharing 