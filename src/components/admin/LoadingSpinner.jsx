// src/components/admin/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#666' }}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;