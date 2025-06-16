// src/services/axiosInstance.js

import axios from 'axios';
import { store } from '../store/index';
import { refreshTokenThunk } from '../slice/refreshTokenThunk';
import { logout } from '../slice/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Trigger refresh token
        await store.dispatch(refreshTokenThunk());

        // Retry the original request with new token
        const state = store.getState();
        const newToken = state.auth.token;

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
