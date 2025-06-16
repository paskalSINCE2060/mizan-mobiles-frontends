// src/components/admin/RecentOrders.jsx
import React from 'react';

const RecentOrders = ({ orders }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    }}>
      <h3 style={{ marginBottom: "20px", color: "#333" }}>Recent Orders</h3>
      {orders.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{order.orderId || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{order.customerName || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>${order.amount || 0}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: order.status === 'completed' ? '#d4edda' : '#fff3cd',
                      color: order.status === 'completed' ? '#155724' : '#856404'
                    }}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{formatDate(order.date) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No recent orders available</p>
      )}
    </div>
  );
};

export default RecentOrders;