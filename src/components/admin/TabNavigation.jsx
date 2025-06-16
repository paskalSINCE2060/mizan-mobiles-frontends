// src/components/admin/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, requests }) => {
  const pendingCount = requests.filter(req => req.status === 'pending').length;

  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'dashboard' ? '#007bff' : 'transparent',
            color: activeTab === 'dashboard' ? 'white' : '#007bff',
            borderBottom: activeTab === 'dashboard' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            borderRadius: activeTab === 'dashboard' ? '4px 4px 0 0' : '0'
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('sell-requests')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'sell-requests' ? '#007bff' : 'transparent',
            color: activeTab === 'sell-requests' ? 'white' : '#007bff',
            borderBottom: activeTab === 'sell-requests' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            position: 'relative',
            borderRadius: activeTab === 'sell-requests' ? '4px 4px 0 0' : '0'
          }}
        >
          Sell Phone Requests
          {pendingCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;