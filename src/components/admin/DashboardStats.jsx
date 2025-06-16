// src/components/admin/DashboardStats.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const DashboardStats = ({ stats, requests, loading }) => {
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Sell Requests',
      value: requests.length,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
    }}>
      {statsCards.map((card, index) => (
        <div
          key={index}
          style={{
            background: card.gradient,
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
            {card.title}
          </h3>
          <p style={{ margin: "0", fontSize: "28px", fontWeight: "bold" }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;