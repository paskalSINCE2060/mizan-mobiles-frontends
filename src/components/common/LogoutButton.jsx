// src/components/common/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../slice/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setUserData }) => { // Accept setUserData as prop
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logout clicked");
    
    try {
      // Clear Redux state
      dispatch(logout());
      
      // Clear local component state if provided
      if (setUserData) {
        setUserData(null);
      }
      
      // Force navigation to login
      navigate('/login', { replace: true });
      
      // Optional: Force page reload to ensure clean state (use if still having issues)
      // window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force reload
      window.location.href = '/login';
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default LogoutButton;