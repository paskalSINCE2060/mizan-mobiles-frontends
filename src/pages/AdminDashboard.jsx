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
import AdminAddProduct from '../components/AdminAddProduct/AdminAddProduct';
import AdminAddOffer from '../components/AdminAddOffer/AdminAddOffer';
import EditProduct from '../components/EditProduct/EditProduct';
import ProductList from '../components/ProductList/ProductList'; // ✅ Import your ProductList component

import api from '../utils/api'; // Custom axios instance

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

  // Fetch dashboard stats
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await api.get('/api/admin/dashboard-stats');
        setTotalProducts(response.data.totalProducts || 0);
      } catch (err) {
        console.error('❌ Error fetching total products:', err);
        setTotalProducts(0);
      }
    };

    if (token) {
      fetchTotalProducts();
    }
  }, [token]);

  // Fetch Sell Phone Requests
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'sell-requests') {
      dispatch(fetchSellPhoneRequests({
        page: 1,
        limit: 20,
        status: statusFilter,
        search: searchTerm
      }));
    }
  }, [dispatch, token, activeTab, statusFilter, searchTerm]);

  // Fetch phone orders if user switches to that tab
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'user-orders') {
      dispatch(fetchPhoneOrders());
    }
  }, [dispatch, token, activeTab]);

  const handleClearError = () => {
    dispatch(clearError());
    dispatch(clearPhoneOrdersError());
  };

  const handleProductAdded = async () => {
    try {
      const response = await api.get('/api/admin/dashboard-stats');
      setTotalProducts(response.data.totalProducts || 0);
    } catch (err) {
      console.error('❌ Error refreshing total products:', err);
    }
  };

  const handleProductUpdated = async () => {
    try {
      const response = await api.get('/api/admin/dashboard-stats');
      setTotalProducts(response.data.totalProducts || 0);
    } catch (err) {
      console.error('❌ Error refreshing total products:', err);
    }
  };

  return (
    <AuthGuard>
      <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>
          Admin Dashboard
        </h1>

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

        {/* ✅ Tab Buttons */}
        <div style={{ marginBottom: 20 }}>
          {[
            { key: 'sell-requests', label: 'Sell Phone Requests' },
            { key: 'user-orders', label: 'Booking Orders' },
            { key: 'checkout-orders', label: 'Checkout Orders' },
            { key: 'add-product', label: 'Add Product' },
            { key: 'edit-product', label: 'Edit Product' },
            { key: 'add-offer', label: 'Add Offer' },
            { key: 'manage-products', label: 'Manage Products' }, // ✅ NEW TAB
          ].map(tab => (
            <button
              key={tab.key}
              style={{
                marginRight: 10,
                marginBottom: 10,
                padding: '10px 20px',
                backgroundColor: activeTab === tab.key ? '#667eea' : '#ccc',
                color: activeTab === tab.key ? 'white' : 'black',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ErrorDisplay
          error={error || userOrdersError}
          clearError={handleClearError}
        />

        {/* ✅ Tab Content */}
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
        {activeTab === 'add-product' && (
          <AdminAddProduct onProductAdded={handleProductAdded} />
        )}
        {activeTab === 'edit-product' && (
          <EditProduct onProductUpdated={handleProductUpdated} />
        )}
        {activeTab === 'add-offer' && <AdminAddOffer />}
        {activeTab === 'manage-products' && <ProductList />} {/* ✅ ProductList tab */}

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
            onQuoteSubmit={() => { }}
            onStatusSubmit={() => { }}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
