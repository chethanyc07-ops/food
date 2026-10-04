import axios from 'axios';

// In the browser, always make relative requests to '/api' so it hits the current host and port
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.INTERNAL_API_URL || 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Safety guard: ensure relative /api path in browser regardless of any env var override
    if (typeof window !== 'undefined') {
      if (config.baseURL && (config.baseURL.includes('localhost:5000') || config.baseURL.includes(':5000'))) {
        config.baseURL = '/api';
      }
      const token = localStorage.getItem('foodpack_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token if invalid and on non-login pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('foodpack_token');
        localStorage.removeItem('foodpack_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
