// src/services/axiosInstance.js

import axios from 'axios';
import { store } from '../store/index';
import { refreshTokenThunk } from '../slice/refreshTokenThunk';
import { logout } from '../slice/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 🔐 REQUEST INTERCEPTOR: Attach token before every request
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

// 🔄 RESPONSE INTERCEPTOR: Refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Skip if already retried once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Dispatch refreshTokenThunk (must return new token in state)
        await store.dispatch(refreshTokenThunk());

        const newState = store.getState();
        const newToken = newState.auth.token;

        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails (expired or invalid), logout the user
        console.error('🔁 Refresh token failed:', refreshError);
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
