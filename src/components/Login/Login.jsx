import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUserData }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev, 
      [name]: value 
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Full Name validation
    if (!credentials.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (credentials.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!credentials.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(credentials.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    // Password validation
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Retrieve stored user data
    const storedUser = JSON.parse(localStorage.getItem('userData'));

    // Check if user exists and credentials match
    if (!storedUser || 
        storedUser.email !== credentials.email || 
        storedUser.password !== credentials.password) {
      alert('Invalid email or password. Please try again or sign up.');
      return;
    }

    // Set user data and create login session
    setUserData(storedUser);
    localStorage.setItem('loggedInUser', JSON.stringify(storedUser));

    // Navigate to homepage
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

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
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={credentials.fullName}
              onChange={handleChange} 
              required 
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          <div className="Login-page input-group">
            <input 
              type="tel" 
              name="phone" 
              placeholder="Number" 
              value={credentials.phone}
              onChange={handleChange} 
              required 
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
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

          <button type="submit" className="Login-page login-button">
            Login
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? 
          <button 
            type="button" 
            onClick={handleSignup}
            className="signup-btn"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;