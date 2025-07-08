import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchSellPhoneRequests,
  clearError,
  selectSellPhoneRequests,
  selectSellPhonePagination,
  selectSellPhoneLoading,
  selectSellPhoneError
} from '../slice/sellPhoneSlice';

// Import phone orders actions and selectors
import { fetchPhoneOrders, clearError as clearPhoneOrdersError } from '../slice/phoneOrderSlice';

import SellRequestsTab from './SellRequestsTab';
import PhoneOrdersManagement from './PhoneOrdersManagement'; // manages user phone orders
import ErrorDisplay from '../components/admin/ErrorDisplay';
import AuthGuard from '../components/admin/AuthGuard';
import RequestModal from '../components/admin/RequestModal'; // modal for quote/status updates
import CheckoutOrdersTab from '../components/admin/CheckoutOrdersTab'; // manages checkout orders

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux selectors for sell phone requests
  const requests = useSelector(selectSellPhoneRequests);
  const pagination = useSelector(selectSellPhonePagination);
  const loading = useSelector(selectSellPhoneLoading);
  const error = useSelector(selectSellPhoneError);

  // Redux selectors for phone orders
  const phoneOrders = useSelector(state => state.phoneOrders);
  const { error: userOrdersError } = phoneOrders;

  const token = useSelector((state) => state.auth.token);

  // Local state
  const [activeTab, setActiveTab] = useState('sell-requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [quoteForm, setQuoteForm] = useState({
    estimatedPrice: '',
    adminNotes: '',
    status: 'quoted'
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });

  // Total products state
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch Sell Phone Requests on mount & filters
  useEffect(() => {
    if (!token) return;
    dispatch(fetchSellPhoneRequests({
      page: 1,
      limit: 20,
      status: statusFilter,
      search: searchTerm
    }));
  }, [dispatch, token, statusFilter, searchTerm]);

  // Fetch phone orders when switching to user-orders tab
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'user-orders') {
      dispatch(fetchPhoneOrders());
    }
  }, [dispatch, token, activeTab]);

  // Fetch total products count from backend
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await res.json();
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        console.error('Error fetching total products:', err);
        setTotalProducts(0);
      }
    };

    if (token) fetchTotalProducts();
  }, [token]);

  // Handle refresh for phone orders
  // (Removed unused handleRefreshPhoneOrders function)

  // Clear errors
  const handleClearError = () => {
    dispatch(clearError());
    dispatch(clearPhoneOrdersError());
  };

  return (
    <AuthGuard>
      <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>
          Admin Dashboard
        </h1>

        {/* Total products display */}
        <div style={{
          marginBottom: 20,
          padding: 20,
          backgroundColor: '#667eea',
          color: 'white',
          borderRadius: 12,
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 'bold'
        }}>
          Total Products: {totalProducts}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20 }}>
          <button
            style={{
              marginRight: 10,
              padding: '10px 20px',
              backgroundColor: activeTab === 'sell-requests' ? '#667eea' : '#ccc',
              color: activeTab === 'sell-requests' ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('sell-requests')}
          >
            Sell Phone Requests
          </button>

          <button
            style={{
              marginRight: 10,
              padding: '10px 20px',
              backgroundColor: activeTab === 'user-orders' ? '#667eea' : '#ccc',
              color: activeTab === 'user-orders' ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('user-orders')}
          >
            User Orders
          </button>

          {/* NEW TAB - Checkout Orders */}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'checkout-orders' ? '#667eea' : '#ccc',
              color: activeTab === 'checkout-orders' ? 'white' : 'black',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('checkout-orders')}
          >
            Checkout Orders
          </button>
        </div>

        <ErrorDisplay
          error={error || userOrdersError}
          clearError={handleClearError}
        />

        {/* Sell Phone Requests Tab */}
        {activeTab === 'sell-requests' && (
          <SellRequestsTab
            requests={requests}
            loading={loading}
            pagination={pagination}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onStatusFilterChange={setStatusFilter}
            onSearch={setSearchTerm}
            onPageChange={(page) =>
              dispatch(fetchSellPhoneRequests({
                page,
                limit: 20,
                status: statusFilter,
                search: searchTerm
              }))
            }
            onOpenModal={(request, type) => {
              setSelectedRequest(request);
              setModalType(type);
              if (type === 'quote') {
                setQuoteForm({
                  estimatedPrice: request.estimatedPrice || '',
                  adminNotes: request.adminNotes || '',
                  status: 'quoted'
                });
              } else {
                setStatusForm({
                  status: request.status,
                  adminNotes: request.adminNotes || ''
                });
              }
              setShowModal(true);
            }}
            onUpdateStatus={(id, status) => {
              dispatch(fetchSellPhoneRequests({
                page: pagination?.currentPage || 1,
                limit: 20,
                status: statusFilter,
                search: searchTerm
              }));
            }}
          />
        )}

        {/* User Orders Tab */}
        {activeTab === 'user-orders' && (
          <PhoneOrdersManagement />
        )}

        {/* NEW TAB CONTENT - Checkout Orders */}
        {activeTab === 'checkout-orders' && (
          <CheckoutOrdersTab />
        )}

        {/* Modal for Quote/Status Updates */}
        {showModal && (
          <RequestModal
            show={showModal}
            selectedRequest={selectedRequest}
            modalType={modalType}
            quoteForm={quoteForm}
            statusForm={statusForm}
            onClose={() => setShowModal(false)}
            onQuoteFormChange={setQuoteForm}
            onStatusFormChange={setStatusForm}
            onQuoteSubmit={() => {/* Add your submit logic here */}}
            onStatusSubmit={() => {/* Add your submit logic here */}}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;