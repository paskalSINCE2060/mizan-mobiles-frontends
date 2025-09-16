// src/services/axiosInstance.js (Updated with enhanced logging)

import axios from 'axios';
import { store } from '../store/index';
import { refreshTokenThunk } from '../slice/refreshTokenThunk'; // Make sure this path is correct
import { logout } from '../slice/authSlice';

const axiosInstance = axios.create({
  baseURL: 'https://mizan-mobile-backend-mizan.up.railway.app/api',
});

// 🔐 REQUEST INTERCEPTOR: Attach token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('🔍 Request Details:');
    console.log('  - Full URL:', config.baseURL + config.url);
    console.log('  - Method:', config.method?.toUpperCase());
    console.log('  - Has Data:', !!config.data);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Authorization header added');
      console.log('  - Token (first 20 chars):', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token available - request will be unauthenticated');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 🔄 RESPONSE INTERCEPTOR: Refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('  - Status:', response.status);
    console.log('  - Response time:', response.config.metadata?.endTime - response.config.metadata?.startTime || 'N/A');
    return response;
  },
  
  async (error) => {
    const originalRequest = error.config;
    
    console.log(`❌ API Response Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`);
    console.log('🔍 Error Analysis:');
    console.log('  - Status Code:', error.response?.status);
    console.log('  - Status Text:', error.response?.statusText);
    console.log('  - Error Message:', error.message);
    console.log('  - Already Retried:', !!originalRequest._retry);
    console.log('  - Is Refresh Endpoint:', originalRequest.url.includes('/auth/refresh'));

    // Skip if already retried once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      console.log('🎯 401 UNAUTHORIZED - Initiating token refresh process...');
      console.log('📋 Refresh Conditions Met:');
      console.log('  ✅ Status is 401');
      console.log('  ✅ Not already retried');
      console.log('  ✅ Not a refresh endpoint');
      
      originalRequest._retry = true;

      try {
        console.log('🚀 Dispatching refresh token thunk...');
        const refreshStartTime = Date.now();
        
        await store.dispatch(refreshTokenThunk());
        
        const refreshEndTime = Date.now();
        console.log('⏱️ Refresh process completed in:', (refreshEndTime - refreshStartTime) + 'ms');

        const newState = store.getState();
        const newToken = newState.auth.token;

        if (newToken) {
          console.log('🔄 Retrying original request with new token...');
          console.log('  - Original URL:', originalRequest.url);
          console.log('  - Original Method:', originalRequest.method?.toUpperCase());
          console.log('  - New Token (first 20 chars):', newToken.substring(0, 20) + '...');
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          const retryStartTime = Date.now();
          const retryResponse = await axiosInstance(originalRequest);
          const retryEndTime = Date.now();
          
          console.log('✅ Original request retry successful!');
          console.log('  - Retry time:', (retryEndTime - retryStartTime) + 'ms');
          console.log('  - Response status:', retryResponse.status);
          
          return retryResponse;
        } else {
          console.error('❌ No new token received after refresh - this should not happen');
          throw new Error('No token after refresh');
        }
      } catch (refreshError) {
        // If refresh fails (expired or invalid), logout the user
        console.error('💥 REFRESH TOKEN PROCESS FAILED');
        console.error('🔍 Refresh Error Details:', refreshError?.response?.data || refreshError.message);
        console.log('🚪 Logging out user due to refresh failure...');
        
        store.dispatch(logout());
        
        console.log('❌ User has been logged out - redirecting to login may be needed');
      }
    } else if (error.response?.status === 401) {
      console.log('⚠️ 401 but refresh conditions not met:');
      console.log('  - Already retried:', !!originalRequest._retry);
      console.log('  - Is refresh endpoint:', originalRequest.url.includes('/auth/refresh'));
    }

    console.log('🔚 Rejecting original error');
    return Promise.reject(error);
  }
);

// Add timing metadata to requests
axiosInstance.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = Date.now();
    return response;
  },
  (error) => {
    if (error.config) {
      error.config.metadata = error.config.metadata || {};
      error.config.metadata.endTime = Date.now();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;