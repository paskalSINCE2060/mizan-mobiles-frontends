import React from 'react';

const AccessDenied = ({ type, userRole }) => {
  if (type === 'auth') {
    return (
      <div className="access-denied">
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (type === 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
        <p className="debug-info">Current role: {userRole}</p>
      </div>
    );
  }

  return null;
};

export default AccessDenied;