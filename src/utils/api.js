// my-app/src/utils/api.js
import axios from 'axios';
import { store } from '../store';
import { logout } from '../slice/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mizan-mobile-backend-mizan.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    console.log('🔑 API Request Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📋 Request Headers:', config.headers);
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔓 Unauthorized - logging out');
      store.dispatch(logout());
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;