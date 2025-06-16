import React, { useState, useEffect } from 'react';
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

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <AuthGuard authError={authError}>
      <div style={{ maxWidth: '1200px', margin: "auto", padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Admin Dashboard
        </h1>

        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          requests={requests}
        />

        <ErrorDisplay 
          error={error} 
          dashboardError={dashboardError}
          clearError={() => dispatch(clearError())}
        />

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats 
              stats={stats}
              requests={requests}
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
            onDelete={(requestId) => {
              if (window.confirm('Are you sure you want to delete this request?')) {
                // Handle delete logic here
                console.log('Delete request:', requestId);
              }
            }}
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
            onQuoteSubmit={(e) => {
              e.preventDefault();
              // Handle quote submission logic
              console.log('Quote submitted:', quoteForm);
              closeModal();
            }}
            onStatusSubmit={(e) => {
              e.preventDefault();
              // Handle status submission logic
              console.log('Status updated:', statusForm);
              closeModal();
            }}
          />
        )}

        {/* CSS for animations */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;