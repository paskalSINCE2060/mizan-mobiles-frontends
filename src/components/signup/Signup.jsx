import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../slice/authThunk';
import { clearAuthError } from '../../slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Clear errors on input change
  const handleChange = (e) => {
    dispatch(clearAuthError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.warn('Password must be at least 6 characters and include letters and numbers.');
      return;
    }

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.number,
      password: formData.password,
    };

    dispatch(signupUser(userData, navigate));
  };

  return (
    <div className="Signup-page signup-container">
      <ToastContainer />
      <h2>Create an Account</h2>
      <p>Join us today!</p>
      <form onSubmit={handleSubmit}>
        <div className="Signup-page input-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="Signup-page input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="Signup-page input-group">
          <input
            type="tel"
            name="number"
            placeholder="Number"
            required
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div className="Signup-page input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="Signup-page input-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="Signup-page signup-button"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="Signup-page login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
