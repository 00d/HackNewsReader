import axios from 'axios';
import { HN_API_BASE } from '../utils/constants';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: HN_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add any request modifications here (auth, logging, etc.)
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
