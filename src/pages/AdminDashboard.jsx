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

import { fetchPhoneOrders, clearError as clearPhoneOrdersError } from '../slice/phoneOrderSlice';

import SellRequestsTab from './SellRequestsTab';
import PhoneOrdersManagement from './PhoneOrdersManagement';
import ErrorDisplay from '../components/admin/ErrorDisplay';
import AuthGuard from '../components/admin/AuthGuard';
import RequestModal from '../components/admin/RequestModal';
import CheckoutOrdersTab from '../components/admin/CheckoutOrdersTab';

import api from '../utils/api'; // ✅ Custom axios instance

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const requests = useSelector(selectSellPhoneRequests);
  const pagination = useSelector(selectSellPhonePagination);
  const loading = useSelector(selectSellPhoneLoading);
  const error = useSelector(selectSellPhoneError);

  const phoneOrders = useSelector(state => state.phoneOrders);
  const { error: userOrdersError } = phoneOrders;

  const token = useSelector((state) => state.auth.token);

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

  const [totalProducts, setTotalProducts] = useState(0);

  // 🔍 DEBUGGING TOKEN INFO
  useEffect(() => {
    console.log('🔍 Current token from Redux:', token);
    console.log('🔍 Current token from localStorage:', localStorage.getItem('authToken'));
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token?.length);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 Token payload:', payload);
      } catch (e) {
        console.error('❌ Token is not valid JWT format:', e);
      }
    }
  }, [token]);

  // 🟢 Fetch Sell Phone Requests
  useEffect(() => {
    if (!token) return;
    dispatch(fetchSellPhoneRequests({
      page: 1,
      limit: 20,
      status: statusFilter,
      search: searchTerm
    }));
  }, [dispatch, token, statusFilter, searchTerm]);

  // 🟢 Fetch phone orders if user switches to that tab
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'user-orders') {
      dispatch(fetchPhoneOrders());
    }
  }, [dispatch, token, activeTab]);

  // 🟢 Fetch total products from backend using API client
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        console.log('🔄 Fetching dashboard stats...');
        const response = await api.get('/api/admin/dashboard-stats');
        console.log('📊 Dashboard stats response:', response.data);
        setTotalProducts(response.data.totalProducts || 0);
      } catch (err) {
        console.error('❌ Error fetching total products:', err);
        console.error('Error details:', err.response?.data);
        setTotalProducts(0);
      }
    };

    if (token) {
      fetchTotalProducts();
    }
  }, [token]);

  // 🧹 Clear errors
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

        {/* 🔢 Total products count */}
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

        {/* 🔘 Tabs */}
        <div style={{ marginBottom: 20 }}>
          {['sell-requests', 'user-orders', 'checkout-orders'].map(tab => (
            <button
              key={tab}
              style={{
                marginRight: 10,
                padding: '10px 20px',
                backgroundColor: activeTab === tab ? '#667eea' : '#ccc',
                color: activeTab === tab ? 'white' : 'black',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'sell-requests' && 'Sell Phone Requests'}
              {tab === 'user-orders' && 'User Orders'}
              {tab === 'checkout-orders' && 'Checkout Orders'}
            </button>
          ))}
        </div>

        <ErrorDisplay
          error={error || userOrdersError}
          clearError={handleClearError}
        />

        {/* Tabs content */}
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
            onUpdateStatus={() => {
              dispatch(fetchSellPhoneRequests({
                page: pagination?.currentPage || 1,
                limit: 20,
                status: statusFilter,
                search: searchTerm
              }));
            }}
          />
        )}

        {activeTab === 'user-orders' && <PhoneOrdersManagement />}
        {activeTab === 'checkout-orders' && <CheckoutOrdersTab />}

        {/* Modal */}
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
            onQuoteSubmit={() => { /* Add submit logic */ }}
            onStatusSubmit={() => { /* Add submit logic */ }}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
