import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // This will be our mock API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;