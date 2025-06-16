// src/components/admin/ErrorDisplay.jsx
import React from 'react';

const ErrorDisplay = ({ error, dashboardError, clearError }) => {
  if (!error && !dashboardError) return null;

  return (
    <div style={{ 
      backgroundColor: '#f8d7da', 
      color: '#721c24', 
      padding: '15px', 
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      Error: {error || dashboardError}
      <button 
        onClick={clearError}
        style={{
          marginLeft: '10px',
          background: 'none',
          border: 'none',
          color: '#721c24',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ErrorDisplay;