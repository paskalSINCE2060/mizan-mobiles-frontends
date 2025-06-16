import axios from 'axios';
import { loginSuccess, logout } from '../slice/authSlice';

export const refreshTokenThunk = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const res = await axios.post('/refresh-token', { refreshToken });

    const { token, user, refreshToken: newRefreshToken } = res.data;

    // Save new tokens
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('refreshToken', newRefreshToken);

    dispatch(loginSuccess({ token, user, refreshToken: newRefreshToken }));
  } catch (error) {
    console.error('Refresh failed:', error);
    dispatch(logout());
  }
};
