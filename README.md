# Restaurant Management System - User Authentication and Role Management

This project implements the user authentication and role management system for a restaurant management application using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Registration and Login
- Role-Based Access Control (Admin and Customer roles)
- Protected Routes
- JWT Authentication
- User Profile Management
- Modern UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
restaurant-management/
│── backend/                # Node.js (Express) server
│   ├── config/            # Database configuration
│   ├── controllers/       # Controllers for handling requests
│   ├── middlewares/       # Authentication and authorization middleware
│   ├── models/           # Mongoose models for users and roles
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Main backend server file
│
│── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/     # Context API for authentication state
│   │   ├── pages/       # React pages
│   │   ├── services/    # API service functions
│   │   ├── App.js       # Main App component
│   │   ├── index.js     # React entry point
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restaurant-management
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a .env file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### User Management (Admin only)
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Role-Based Access Control

### Admin Role
- Full access to user management
- Can view all users
- Can modify user roles
- Can delete users

### Customer Role
- Can register and login
- Can view and update their own profile
- Cannot access admin features

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Protected routes
- Role-based authorization
- Input validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 