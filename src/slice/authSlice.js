// src/slice/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load auth data from localStorage on init - using consistent keys
const savedToken = localStorage.getItem('token'); // Changed from 'authToken'
const savedUser = localStorage.getItem('loggedInUser'); // Changed from 'authUser'
const savedRefreshToken = localStorage.getItem('refreshToken');

const initialState = {
  token: savedToken || null,
  refreshToken: savedRefreshToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
  signupLoading: false,
  signupError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Use consistent keys with App.js
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('loggedInUser', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    signupStart(state) {
      state.signupLoading = true;
      state.signupError = null;
    },
    signupSuccess(state, action) {
      state.signupLoading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Use consistent keys with App.js
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('loggedInUser', JSON.stringify(action.payload.user));
    },
    signupFailure(state, action) {
      state.signupLoading = false;
      state.signupError = action.payload;
    },

    logout(state) {
      console.log("Redux logout reducer called");
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear all possible localStorage keys
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authToken'); // Clean up old key if exists
      localStorage.removeItem('authUser'); // Clean up old key if exists
      localStorage.removeItem('cartItems'); // Optional: clear cart on logout
      localStorage.removeItem('wishlistItems'); // Optional: clear wishlist on logout
    },

    clearAuthError(state) {
      state.error = null;
      state.signupError = null;
    },

    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },

    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('loggedInUser', JSON.stringify(action.payload));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  clearAuthError,
  setToken,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;