
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSellPhoneRequests,
  setFilters,
  clearError,
  selectSellPhoneRequests,
  selectSellPhonePagination,
  selectSellPhoneLoading,
  selectSellPhoneError
} from '../slice/sellPhoneSlice';

// Import components
import DashboardStats from '../components/admin/DashboardStats';
import DashboardCharts from '../components/admin/DashboardCharts';
import SellRequestsTable from '../components/admin/SellRequestsTable';
import RequestModal from '../components/admin/RequestModal';
import TabNavigation from '../components/admin/TabNavigation';
import ErrorDisplay from '../components/admin/ErrorDisplay';
import AuthGuard from '../components/admin/AuthGuard';
import BookingManagement from '../components/admin/BookingManagement';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const requests = useSelector(selectSellPhoneRequests);
  const pagination = useSelector(selectSellPhonePagination);
  const loading = useSelector(selectSellPhoneLoading);
  const error = useSelector(selectSellPhoneError);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  // Local state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Booking state
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  
  // ✅ Notification state
  const [previousPendingCount, setPreviousPendingCount] = useState(0);
  const [notificationSound] = useState(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L3xHkpBSl+zPLaizsIGGS57OGYTgwOUarm7bVdGgU+ltryxnkpBSJ2xe/eizEIFmm+8OScTgwOUarm7LJeGgU6k9n0yoQ2Byp+zPDagjUIFmS56eObUgwPUrDl6rBeGwU2jdj0z4k8CCV+y+/ZhzMIE2G66OGYTwwOUars7rJiHgU1jNn0z4s9CSB9yu7ahzcIF2K76eKXTgwOUanq7rJiHgU1i9nzzos9CSB9yu7ahzcIF2O76eKXTgwOUanq7rNiHgU1i9nzzos9CSB8yu7ahzcIF2O76eKXTwwPUanq7rNjHgU1i9nzzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nzzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9CSB8yu7ahzcIF2O76eKXTwwPUanr7rNjHgU1i9nyzos9=')); 
  
  // Dashboard stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    salesOverTime: [],
    categoryDistribution: {},
    recentOrders: [],
    topProducts: [],
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    estimatedPrice: '',
    adminNotes: '',
    status: 'quoted'
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });

  // ✅ Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
        }
      });
    }
  }, []);

  // ✅ Function to show browser notification
  const showBrowserNotification = (title, body, data = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Play notification sound
      notificationSound.play().catch(e => console.log('Could not play notification sound'));
      
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico', // Use your app icon
        badge: '/favicon.ico',
        tag: 'booking-notification',
        data,
        requireInteraction: true
      });
      
      notification.onclick = () => {
        window.focus();
        setActiveTab('bookings');
        notification.close();
      };
      
      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  // Check authentication
  useEffect(() => {
    if (!token) {
      setAuthError("Please log in to access admin dashboard");
      return;
    }
    if (user && user.role !== 'admin') {
      setAuthError("Access denied. Admin privileges required.");
      return;
    }
    setAuthError(null);
  }, [token, user]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        setDashboardLoading(true);
        setDashboardError(null);

        const res = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          setAuthError("Session expired. Please log in again.");
          return;
        }

        if (res.status === 403) {
          setAuthError("Access denied. Admin privileges required.");
          return;
        }

        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          salesOverTime: Array.isArray(data.salesOverTime) ? data.salesOverTime : [],
          categoryDistribution: data.categoryDistribution || {},
          recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
          topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
        });
        
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
        setDashboardError(err.message);
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          salesOverTime: [],
          categoryDistribution: {},
          recentOrders: [],
          topProducts: [],
        });
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  // Fetch booking requests - using useCallback to fix ESLint warning
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    
    try {
      setBookingLoading(true);
      setBookingError(null);

      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setAuthError("Session expired. Please log in again.");
        return;
      }

      if (response.status === 403) {
        setAuthError("Access denied. Admin privileges required.");
        return;
      }

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingError(`Failed to load bookings: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  }, [token, setAuthError]);

  // ✅ Polling function to check for new bookings and notifications
  useEffect(() => {
    let intervalId;
    
    if (token) {
      // Initial check
      const checkForUpdates = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/bookings/notifications/count', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const { pendingBookings, todayBookings, totalBookings } = data.data;
            
            // Show notification if there are new pending bookings
            if (pendingBookings > previousPendingCount && previousPendingCount > 0) {
              const newBookingsCount = pendingBookings - previousPendingCount;
              showBrowserNotification(
                '🔧 New Repair Booking!',
                `You have ${newBookingsCount} new repair booking${newBookingsCount > 1 ? 's' : ''}. Total pending: ${pendingBookings}`,
                { type: 'booking', count: newBookingsCount }
              );
            }
            
            // Update state for comparison next time
            setPreviousPendingCount(pendingBookings);
          }
        } catch (error) {
          console.error('Error checking for new bookings:', error);
        }
      };

      // Check immediately and then every 30 seconds
      checkForUpdates();
      intervalId = setInterval(checkForUpdates, 30000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, previousPendingCount, showBrowserNotification]);

  // Fetch sell phone requests when tab changes or filters change
  useEffect(() => {
    if (activeTab === 'sell-requests' && token) {
      dispatch(fetchSellPhoneRequests({
        page: 1,
        limit: 20,
        status: statusFilter,
        search: searchTerm
      }));
    }
  }, [dispatch, activeTab, statusFilter, searchTerm, token]);

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings' && token) {
      fetchBookings();
    }
  }, [activeTab, token, fetchBookings]);

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    dispatch(setFilters({ status, page: 1 }));
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setFilters({ search: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(fetchSellPhoneRequests({
      page: newPage,
      limit: 20,
      status: statusFilter,
      search: searchTerm
    }));
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
      } else {
        throw new Error(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setBookingError(`Failed to update booking status: ${error.message}`);
    }
  };

  // Update sell request status
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sell-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the requests data
        dispatch(fetchSellPhoneRequests({
          page: pagination?.currentPage || 1,
          limit: 20,
          status: statusFilter,
          search: searchTerm
        }));
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      dispatch(clearError());
      // Set a temporary error that will be cleared
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  };

  // Open modal for quote or status update
  const openModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
    
    if (type === 'quote') {
      setQuoteForm({
        estimatedPrice: request.estimatedPrice || '',
        adminNotes: request.adminNotes || '',
        status: 'quoted'
      });
    } else if (type === 'status') {
      setStatusForm({
        status: request.status,
        adminNotes: request.adminNotes || ''
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalType('');
    setQuoteForm({ estimatedPrice: '', adminNotes: '', status: 'quoted' });
    setStatusForm({ status: '', adminNotes: '' });
  };

  // Handle quote submission
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/sell-requests/${selectedRequest._id}/quote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteForm)
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || 'Failed to submit quote');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the requests data
        dispatch(fetchSellPhoneRequests({
          page: pagination?.currentPage || 1,
          limit: 20,
          status: statusFilter,
          search: searchTerm
        }));
        closeModal();
      } else {
        throw new Error(data.message || 'Failed to submit quote');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      // Handle error display
    }
  };

  // Handle status submission
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/sell-requests/${selectedRequest._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusForm)
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || 'Failed to update status');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the requests data
        dispatch(fetchSellPhoneRequests({
          page: pagination?.currentPage || 1,
          limit: 20,
          status: statusFilter,
          search: searchTerm
        }));
        closeModal();
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error display
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Calculate stats for dashboard
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const totalRequests = requests.length;
  const totalBookings = bookings.length;

  // Enhanced stats with bookings
  const enhancedStats = {
    ...stats,
    totalRequests,
    pendingRequests,
    totalBookings,
    pendingBookings
  };

  return (
    <AuthGuard authError={authError}>
      <div style={{ maxWidth: '1200px', margin: "auto", padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Admin Dashboard
          {/* ✅ Show notification status */}
          {Notification.permission === 'granted' && (
            <span style={{ 
              fontSize: '12px', 
              color: '#28a745', 
              display: 'block',
              fontWeight: 'normal'
            }}>
              🔔 Notifications Enabled
            </span>
          )}
        </h1>

        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          requests={requests}
          bookings={bookings}
        />

        <ErrorDisplay 
          error={error || bookingError} 
          dashboardError={dashboardError}
          clearError={() => {
            dispatch(clearError());
            setBookingError(null);
          }}
        />

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats 
              stats={enhancedStats}
              requests={requests}
              bookings={bookings}
              loading={dashboardLoading}
            />
            <DashboardCharts stats={stats} />
          </>
        )}

        {/* Sell Phone Requests Tab Content */}
        {activeTab === 'sell-requests' && (
          <SellRequestsTable
            requests={requests}
            loading={loading}
            pagination={pagination}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onStatusFilterChange={handleStatusFilterChange}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onOpenModal={openModal}
            onUpdateStatus={updateRequestStatus}
            onDelete={(requestId) => {
              if (window.confirm('Are you sure you want to delete this request?')) {
                // Handle delete logic here
                console.log('Delete request:', requestId);
              }
            }}
          />
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <BookingManagement 
            bookings={bookings}
            loading={bookingLoading}
            error={bookingError}
            updateBookingStatus={updateBookingStatus}
            onRefresh={fetchBookings}
          />
        )}

        {/* Modal for Quote/Status Updates */}
        {showModal && (
          <RequestModal
            show={showModal}
            selectedRequest={selectedRequest}
            modalType={modalType}
            quoteForm={quoteForm}
            statusForm={statusForm}
            onClose={closeModal}
            onQuoteFormChange={setQuoteForm}
            onStatusFormChange={setStatusForm}
            onQuoteSubmit={handleQuoteSubmit}
            onStatusSubmit={handleStatusSubmit}
          />
        )}

        {/* CSS for animations */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .tab-button {
              padding: 10px 20px;
              border: none;
              background-color: transparent;
              color: #007bff;
              cursor: pointer;
              font-size: 16px;
              position: relative;
              border-radius: 4px 4px 0 0;
              transition: all 0.3s ease;
            }
            
            .tab-button.active {
              background-color: #007bff;
              color: white;
              border-bottom: 2px solid #007bff;
            }
            
            .tab-button:hover:not(.active) {
              background-color: #f8f9fa;
            }
            
            .notification-badge {
              position: absolute;
              top: -5px;
              right: -5px;
              background-color: #dc3545;
              color: white;
              border-radius: 50%;
              padding: 2px 6px;
              font-size: 12px;
              min-width: 20px;
              text-align: center;
              animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            
            .loading-spinner {
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid #007bff;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            .card {
              background: white;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border: 1px solid #dee2e6;
              transition: box-shadow 0.3s ease;
            }
            
            .card:hover {
              box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .status-pending {
              background-color: #fff3cd;
              color: #856404;
            }
            
            .status-approved {
              background-color: #d4edda;
              color: #155724;
            }
            
            .status-rejected {
              background-color: #f8d7da;
              color: #721c24;
            }
            
            .status-quoted {
              background-color: #d1ecf1;
              color: #0c5460;
            }
            
            .btn {
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.3s ease;
              text-decoration: none;
              display: inline-block;
            }
            
            .btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
            
            .btn-primary {
              background-color: #007bff;
              color: white;
            }
            
            .btn-primary:hover:not(:disabled) {
              background-color: #0056b3;
            }
            
            .btn-success {
              background-color: #28a745;
              color: white;
            }
            
            .btn-success:hover:not(:disabled) {
              background-color: #1e7e34;
            }
            
            .btn-danger {
              background-color: #dc3545;
              color: white;
            }
            
            .btn-danger:hover:not(:disabled) {
              background-color: #c82333;
            }
            
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
            
            .btn-secondary:hover:not(:disabled) {
              background-color: #545b62;
            }
          `}
        </style>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;