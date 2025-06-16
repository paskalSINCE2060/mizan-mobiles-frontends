// src/components/admin/AuthGuard.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children, authError }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  if (authError) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          🚫
        </div>
        <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>
          Access Denied
        </h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          {authError}
        </p>
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Debug Info:</strong>
          <ul style={{ textAlign: 'left', marginTop: '10px' }}>
            <li>Token present: {!!token ? 'Yes' : 'No'}</li>
            <li>User role: {user?.role || 'Not set'}</li>
            <li>User email: {user?.email || 'Not logged in'}</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return children;
};

export default AuthGuard;