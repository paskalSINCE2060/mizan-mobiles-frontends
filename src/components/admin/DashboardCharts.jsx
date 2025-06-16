// src/components/admin/DashboardCharts.jsx
import React from 'react';
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import RecentOrders from './RecentOrders';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ stats }) => {
  // Chart configurations
  const salesLineData = {
    labels: Array.isArray(stats.salesOverTime) ? stats.salesOverTime.map((d) => d.month || '') : [],
    datasets: [
      {
        label: "Sales ($)",
        data: Array.isArray(stats.salesOverTime) ? stats.salesOverTime.map((d) => d.sales || 0) : [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const categoryLabels = stats.categoryDistribution ? Object.keys(stats.categoryDistribution) : [];
  const categoryValues = stats.categoryDistribution ? Object.values(stats.categoryDistribution) : [];
  const categoryPieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Products by Category",
        data: categoryValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6B6B",
          "#4ECDC4",
        ],
      },
    ],
  };

  const topProductsData = {
    labels: Array.isArray(stats.topProducts) 
      ? stats.topProducts.map(p => {
          if (p.productInfo && Array.isArray(p.productInfo) && p.productInfo[0]) {
            return p.productInfo[0].name || 'Unknown';
          }
          return p.productName || 'Unknown';
        }).slice(0, 5)
      : [],
    datasets: [
      {
        label: "Units Sold",
        data: Array.isArray(stats.topProducts) ? stats.topProducts.map(p => p.totalSold || 0).slice(0, 5) : [],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* Charts Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "30px",
        marginBottom: "40px",
      }}>
        {/* Sales Over Time Chart */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}>
          <h3 style={{ marginBottom: "20px", color: "#333" }}>Sales Over Time</h3>
          {stats.salesOverTime.length > 0 ? (
            <Line data={salesLineData} options={{ responsive: true }} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No sales data available</p>
          )}
        </div>

        {/* Category Distribution Chart */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}>
          <h3 style={{ marginBottom: "20px", color: "#333" }}>Category Distribution</h3>
          {categoryLabels.length > 0 ? (
            <Pie data={categoryPieData} options={{ responsive: true }} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No category data available</p>
          )}
        </div>
      </div>

      {/* Top Products Chart */}
      <div style={{
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "40px",
      }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Top Selling Products</h3>
        {stats.topProducts.length > 0 ? (
          <Bar data={topProductsData} options={{ responsive: true }} />
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>No product sales data available</p>
        )}
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={stats.recentOrders} />
    </>
  );
};

export default DashboardCharts;