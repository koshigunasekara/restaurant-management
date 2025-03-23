import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  register: async (userData) => {
    try {
      console.log('Attempting to register with data:', userData);
      const response = await api.post('/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (!error.response) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Attempting to login with:', credentials.email);
      const response = await api.post('/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (!error.response) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 