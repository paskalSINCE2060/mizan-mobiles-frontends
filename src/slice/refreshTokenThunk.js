import axios from 'axios';
import { loginSuccess, logout } from '../slice/authSlice';

export const refreshTokenThunk = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const res = await axios.post('/refresh-token', { refreshToken });

    const { token, user, refreshToken: newRefreshToken } = res.data;

    // Save new tokens and user in localStorage with same keys as authSlice expects
    localStorage.setItem('token', token);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    localStorage.setItem('refreshToken', newRefreshToken);

    dispatch(loginSuccess({ token, user, refreshToken: newRefreshToken }));
  } catch (error) {
    console.error('Refresh token failed:', error);
    dispatch(logout());
  }
};
