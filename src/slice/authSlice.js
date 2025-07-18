// my-app/src/slice/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, refreshTokenThunk } from './authThunk';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signupError: null,
  signupLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token, user, refreshToken } = action.payload;
      state.token = token;
      state.user = user;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    updateUserProfile(state, action) {
      const updatedUser = action.payload;
      const mergedUser = {
        ...state.user,
        ...updatedUser,
        role: updatedUser.role || state.user?.role,
        profileImage: updatedUser.profileImage || state.user?.profileImage,
        updatedAt: new Date().toISOString(),
      };

      state.user = mergedUser;
      localStorage.setItem('loggedInUser', JSON.stringify(mergedUser));
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.signupError = null;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('loggedInUser');
    },

    clearAuthError(state) {
      state.error = null;
      state.signupError = null;
    },

    // Add this to initialize state from localStorage
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('loggedInUser');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.user = user;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser');
          localStorage.removeItem('refreshToken');
        }
      }
    },
  },
  
  // ADD THIS SECTION - extraReducers to handle async thunks
  extraReducers: (builder) => {
    builder
      // Handle loginUser thunk
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Handle signupUser thunk
      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.signupError = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload;
        state.isAuthenticated = false;
      })
      
      // Handle refreshTokenThunk
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't automatically logout on refresh token failure
        // You might want to handle this differently
      });
  },
});

export const {
  loginSuccess,
  updateUserProfile,
  logout,
  clearAuthError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;