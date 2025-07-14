import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser } from './authThunk';

const safeSaveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
};

const initialState = {
  user: JSON.parse(localStorage.getItem('loggedInUser')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
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

      safeSaveToStorage('token', token);
      safeSaveToStorage('loggedInUser', user);
      safeSaveToStorage('refreshToken', refreshToken);
    },

    updateUserProfile(state, action) {
      const updatedUser = action.payload;
      const mergedUser = {
        ...state.user,
        ...updatedUser,
        id: state.user?.id || updatedUser.id,
        _id: state.user?._id || updatedUser._id,
        email: state.user?.email || updatedUser.email,
        phone: state.user?.phone || updatedUser.phone,
        number: state.user?.number || updatedUser.number,
        profileImage: updatedUser.profileImage || state.user?.profileImage,
        createdAt: state.user?.createdAt,
        role: state.user?.role,
        updatedAt: new Date().toISOString(),
      };

      state.user = mergedUser;
      safeSaveToStorage('loggedInUser', mergedUser);
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.signupError = null;

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('loggedInUser');
    },

    clearAuthError(state) {
      state.error = null;
      state.signupError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Login Thunk
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        safeSaveToStorage('token', action.payload.token);
        safeSaveToStorage('refreshToken', action.payload.refreshToken);
        safeSaveToStorage('loggedInUser', action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Signup Thunk
      .addCase(signupUser.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.signupError = null;

        safeSaveToStorage('token', action.payload.token);
        safeSaveToStorage('refreshToken', action.payload.refreshToken);
        safeSaveToStorage('loggedInUser', action.payload.user);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload || 'Signup failed';
      });

    // ✅ Do NOT add refreshTokenThunk to extraReducers because it's not a createAsyncThunk
  }
});

export const {
  loginSuccess,
  updateUserProfile,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
