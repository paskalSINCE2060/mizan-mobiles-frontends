// src/slice/refreshTokenThunk.js (Updated with detailed logging)

import axios from 'axios';
import { loginSuccess, logout } from './authSlice';

export const refreshTokenThunk = () => async (dispatch, getState) => {
  console.log('🔄 ========== REFRESH TOKEN PROCESS STARTED ==========');
  
  try {
    // 1. Get refresh token from Redux state
    const state = getState();
    const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');
    const currentToken = state.auth.token;
    
    console.log('📊 Current Auth State:');
    console.log('  - Is Authenticated:', state.auth.isAuthenticated);
    console.log('  - User:', state.auth.user?.email || state.auth.user?.username || 'No user');
    console.log('  - Current Access Token:', currentToken ? `${currentToken.substring(0, 20)}...` : 'None');
    console.log('  - Refresh Token Available:', !!refreshToken);
    console.log('  - Refresh Token Source:', state.auth.refreshToken ? 'Redux State' : localStorage.getItem('refreshToken') ? 'localStorage' : 'None');

    if (!refreshToken) {
      console.error('❌ No refresh token found in Redux state or localStorage');
      throw new Error('No refresh token found');
    }

    console.log('🔑 Refresh Token (first 20 chars):', refreshToken.substring(0, 20) + '...');

    // 2. Send refresh request to backend
    console.log('📡 Sending refresh request to: https://mizan-mobile-backend-mizan.up.railway.app/api/refresh-token');
    console.log('📤 Request payload:', { refreshToken: refreshToken.substring(0, 20) + '...' });
    
    const startTime = Date.now();
    const res = await axios.post('https://mizan-mobile-backend-mizan.up.railway.app/api/refresh-token', { 
      refreshToken 
    });
    const endTime = Date.now();
    
    console.log('⏱️ Request completed in:', (endTime - startTime) + 'ms');
    console.log('✅ Refresh request successful!');
    console.log('📥 Response status:', res.status);
    console.log('📥 Response data structure:', Object.keys(res.data));

    const { token, user, refreshToken: newRefreshToken } = res.data;
    
    // Validate response data
    if (!token) {
      console.error('❌ No new access token in response');
      throw new Error('No access token received');
    }
    
    if (!user) {
      console.error('❌ No user data in response');
      throw new Error('No user data received');
    }

    console.log('🆕 New Tokens Received:');
    console.log('  - New Access Token:', token.substring(0, 20) + '...');
    console.log('  - New Refresh Token:', newRefreshToken ? newRefreshToken.substring(0, 20) + '...' : 'Same as before');
    console.log('  - User Data:', user.email || user.username || 'Present');

    // Check if tokens are actually different
    if (currentToken === token) {
      console.warn('⚠️ Warning: New access token is the same as current token');
    } else {
      console.log('✅ Access token successfully updated');
    }

    // 3. Dispatch loginSuccess to update Redux & localStorage
    console.log('💾 Updating Redux state and localStorage...');
    dispatch(loginSuccess({ token, user, refreshToken: newRefreshToken }));

    // Verify the update worked
    const newState = getState();
    console.log('✅ State Update Verification:');
    console.log('  - Redux Token Updated:', newState.auth.token === token);
    console.log('  - Redux User Updated:', !!newState.auth.user);
    console.log('  - Is Authenticated:', newState.auth.isAuthenticated);
    console.log('  - localStorage Token:', localStorage.getItem('token') === token);
    console.log('  - localStorage User:', !!localStorage.getItem('loggedInUser'));

    console.log('🎉 ========== REFRESH TOKEN PROCESS COMPLETED SUCCESSFULLY ==========');
    
    return { token, user, refreshToken: newRefreshToken };
    
  } catch (error) {
    console.log('❌ ========== REFRESH TOKEN PROCESS FAILED ==========');
    console.error('🔍 Error Details:');
    console.error('  - Error Type:', error.name);
    console.error('  - Error Message:', error.message);
    
    if (error.response) {
      console.error('  - HTTP Status:', error.response.status);
      console.error('  - HTTP Status Text:', error.response.statusText);
      console.error('  - Response Data:', error.response.data);
      console.error('  - Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('  - Request made but no response received');
      console.error('  - Request:', error.request);
    } else {
      console.error('  - Error setting up request:', error.message);
    }
    
    console.error('  - Full Error Stack:', error.stack);

    console.log('🚪 Logging out user due to refresh failure...');
    dispatch(logout()); // Clear state + localStorage
    
    // Verify logout worked
    const finalState = getState();
    console.log('🧹 Logout Verification:');
    console.log('  - Redux cleared:', !finalState.auth.token && !finalState.auth.user);
    console.log('  - localStorage cleared:', !localStorage.getItem('token') && !localStorage.getItem('loggedInUser'));
    
    console.log('❌ ========== REFRESH TOKEN PROCESS ENDED WITH FAILURE ==========');
    
    throw error; // Let axiosInstance handle the rejection
  }
};