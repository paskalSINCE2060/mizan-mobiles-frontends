// src/slice/refreshTokenThunk.js

import axios from 'axios';
import { loginSuccess, logout } from './authSlice';

export const refreshTokenThunk = () => async (dispatch, getState) => {
  try {
    // 1. Get refresh token from Redux state
    const state = getState();
    const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');

    if (!refreshToken) throw new Error('No refresh token found');

    // 2. Send refresh request to backend
    const res = await axios.post('http://localhost:5000/api/refresh-token', { refreshToken });

    const { token, user, refreshToken: newRefreshToken } = res.data;

    // 3. Dispatch loginSuccess to update Redux & localStorage
    dispatch(loginSuccess({ token, user, refreshToken: newRefreshToken }));

    return { token, user, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('🔁 Refresh token failed:', error?.response?.data || error.message);

    dispatch(logout()); // Clear state + localStorage
    throw error; // Let axiosInstance handle the rejection
  }
};
