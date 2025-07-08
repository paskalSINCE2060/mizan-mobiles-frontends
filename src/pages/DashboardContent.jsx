import React from 'react';
import DashboardStats from '../components/admin/DashboardStats';
import DashboardCharts from '../components/admin/DashboardCharts';

const DashboardContent = ({ stats, dashboardLoading, requests, bookings, phoneOrders }) => {
  const enhancedStats = {
    ...stats,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalPhoneOrders: phoneOrders.length,
    pendingPhoneOrders: phoneOrders.filter(p => p.status === 'pending').length
  };

  return (
    <>
      <DashboardStats 
        stats={enhancedStats}
        requests={requests}
        loading={dashboardLoading}
      />
      <DashboardCharts stats={enhancedStats} />
    </>
  );
};

export default DashboardContent;
