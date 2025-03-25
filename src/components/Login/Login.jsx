import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUserData }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || storedUser.email !== credentials.email || storedUser.password !== credentials.password) {
      alert('Invalid email or password. Please try again or sign up.');
      return;
    }

    setUserData(storedUser);
    localStorage.setItem('loggedInUser', JSON.stringify(storedUser)); // Save session
    navigate('/profile');
  };

  return (
    <div className="login-page-main-container">
    <div className="Login-page login-container">
        <h2>Welcome Back!</h2>
        <p>Log in to continue</p>
        <form onSubmit={handleSubmit}>
        <div className="Login-page input-group">
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        </div>
        <div className="Login-page input-group">
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
        </div>
        <div className="Login-page input-group">
            <input type="tel" name="phone" placeholder="Number" required onChange={handleChange} />
        </div>
        <div className="Login-page input-group">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        </div>
        <button type="submit" className="Login-page login-button">Login</button>
        </form>
    </div>
    </div>
  );
};

export default Login;


