// src/components/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../slice/authThunk';
import { clearAuthError } from '../../slice/authSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!credentials.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(credentials.email)) newErrors.email = 'Invalid email format';

    if (!credentials.password) newErrors.password = 'Password is required';
    else if (credentials.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginUser(credentials));
  };

    useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="login-page-main-container">
      <div className="Login-page login-container">
        <h2>Welcome Back!</h2>
        <p>Log in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="Login-page input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="Login-page input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button type="submit" className="Login-page login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="signup-link">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')} className="signup-btn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
