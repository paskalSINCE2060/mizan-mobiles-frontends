// src/components/common/RequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Redirect to login and preserve the intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
