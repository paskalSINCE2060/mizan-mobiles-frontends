import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Login user thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error || 'Login failed');
        return rejectWithValue(data.message || data.error || 'Login failed');
      }

      const loginData = {
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id || data.user._id,
          _id: data.user._id || data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          phone: data.user.phone || data.user.number,
          number: data.user.number || data.user.phone,
          dateOfBirth: data.user.dateOfBirth,
          location: data.user.location,
          bio: data.user.bio,
          gender: data.user.gender,
          profileImage: data.user.profileImage,
          role: data.user.role || 'user',
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt
        }
      };

      // Save full user object to localStorage
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("refreshToken", loginData.refreshToken);
      localStorage.setItem("loggedInUser", JSON.stringify(loginData.user)); // ✅ FIXED

      toast.success('Login successful');
      return loginData;
    } catch (error) {
      toast.error(error.message || 'Login error');
      return rejectWithValue(error.message || 'Login error');
    }
  }
);

// Signup user thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error || 'Signup failed');
        return rejectWithValue(data.message || data.error || 'Signup failed');
      }

      const signupData = {
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id || data.user._id,
          _id: data.user._id || data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          phone: data.user.phone || data.user.number,
          number: data.user.number || data.user.phone,
          dateOfBirth: data.user.dateOfBirth,
          location: data.user.location,
          bio: data.user.bio,
          gender: data.user.gender,
          profileImage: data.user.profileImage,
          role: data.user.role || 'user',
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt
        }
      };

      // Save full user object to localStorage
      localStorage.setItem("token", signupData.token);
      localStorage.setItem("refreshToken", signupData.refreshToken);
      localStorage.setItem("loggedInUser", JSON.stringify(signupData.user)); // ✅ FIXED

      toast.success('Signup successful. Redirecting...');
      navigate('/login');
      return signupData;
    } catch (error) {
      toast.error(error.message || 'Signup error');
      return rejectWithValue(error.message || 'Signup error');
    }
  }
);

// Refresh token thunk
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error || 'Token refresh failed');
        return rejectWithValue(data.message || data.error || 'Token refresh failed');
      }

      const refreshedData = {
        token: data.token,
        user: {
          id: data.user.id || data.user._id,
          _id: data.user._id || data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          phone: data.user.phone || data.user.number,
          number: data.user.number || data.user.phone,
          dateOfBirth: data.user.dateOfBirth,
          location: data.user.location,
          bio: data.user.bio,
          gender: data.user.gender,
          profileImage: data.user.profileImage,
          role: data.user.role || 'user',
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt
        }
      };

      localStorage.setItem("token", refreshedData.token);
      return refreshedData;
    } catch (error) {
      console.error('Token refresh error:', error);
      toast.error(error.message || 'Token refresh failed');
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);
