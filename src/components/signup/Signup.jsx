import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const existingUser = JSON.parse(localStorage.getItem('userData'));
    if (existingUser && existingUser.email === formData.email) {
      alert('Email already registered. Please log in.');
      navigate('/login');
      return;
    }

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      number:formData.number,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert('Signup successful! Please log in.');
    navigate('/login');
  };

  return (
    <div className="Signup-page signup-container">
      <h2>Create an Account</h2>
      <p>Join us today!</p>
      <form onSubmit={handleSubmit}>
        <div className="Signup-page input-group">
          <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
        </div>
        <div className="Signup-page input-group">
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        </div>
        <div className="Signup-page input-group">
          <input type="tel" name="number" placeholder="Number" required onChange={handleChange} />
        </div>
        <div className="Signup-page input-group">
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        </div>
        <div className="Signup-page input-group">
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
        </div>
        <button type="submit" className="Signup-page signup-button">Sign Up</button>
        <p className="Signup-page login-text">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
