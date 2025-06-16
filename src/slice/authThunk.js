// src/slice/authThunk.js
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from './authSlice';
import { toast } from 'react-toastify';

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(loginSuccess({ 
        token: data.token, 
        refreshToken: data.refreshToken, 
        user: data.user 
      }));

      // ✅ Save user and token to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      }));
      localStorage.setItem("token", data.token);
    } else {
      dispatch(loginFailure(data.message || 'Login failed'));
      toast.error(data.message || 'Login failed');
    }
  } catch (error) {
    dispatch(loginFailure('Network error'));
    toast.error('Network error');
  }
};

export const signupUser = (userData, navigate) => async (dispatch) => {
  dispatch(signupStart());
  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(signupSuccess({ 
        token: data.token, 
        refreshToken: data.refreshToken, 
        user: data.user 
      }));
      toast.success('Your account has been created successfully.');
      navigate('/login');
    } else {
      dispatch(signupFailure(data.message || 'Signup failed'));
      toast.error(data.message || 'Signup failed');
    }
  } catch (err) {
    dispatch(signupFailure('Network error during signup'));
    toast.error('Network error during signup');
  }
};
