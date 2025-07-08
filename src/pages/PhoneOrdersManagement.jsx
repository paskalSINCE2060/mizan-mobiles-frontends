import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhoneOrders, updatePhoneOrderStatus, clearError } from '../slice/phoneOrderSlice';
import './PhoneOrdersManagement.css';

const PhoneOrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders: phoneOrders, loading, error } = useSelector(state => state.phoneOrders);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchPhoneOrders());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Ensure phoneOrders is always an array
  const ordersArray = Array.isArray(phoneOrders) ? phoneOrders : [];

  const filteredOrders = ordersArray.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = !searchTerm ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(updatePhoneOrderStatus({ orderId, status: newStatus }));
  };

  const handleRefresh = () => {
    dispatch(fetchPhoneOrders());
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#6f42c1';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Calculate statistics - use ordersArray to ensure it's always an array
  const stats = {
    total: ordersArray.length,
    pending: ordersArray.filter(order => order.status === 'pending').length,
    confirmed: ordersArray.filter(order => order.status === 'confirmed').length,
    processing: ordersArray.filter(order => order.status === 'processing').length,
    shipped: ordersArray.filter(order => order.status === 'shipped').length,
    delivered: ordersArray.filter(order => order.status === 'delivered').length,
    cancelled: ordersArray.filter(order => order.status === 'cancelled').length,
  };

  const totalRevenue = ordersArray
    .filter(order => order.status !== 'cancelled')
    .reduce((total, order) => total + (order.totalPrice || 0), 0);

  if (loading && ordersArray.length === 0) {
    return (
      <div className="phone-orders-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading phone orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="phone-orders-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <strong>Error:</strong> {error}
        </div>
        <button onClick={handleRefresh} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="phone-orders-management">
      <div className="phone-orders-header">
        <div className="header-left">
          <h1 className="page-title">📱 Phone Orders Management</h1>
          <p className="page-subtitle">Manage and track phone orders</p>
        </div>
        <div className="header-right">
          <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
            {loading ? '🔄' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="phone-orders-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.shipped}</div>
            <div className="stat-label">Shipped</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="phone-orders-filters">
        <div className="filter-group">
          <label htmlFor="search">🔍 Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, email, phone, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="status-filter">📋 Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="phone-orders-table-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📱</div>
            <div className="no-orders-text">
              {searchTerm || statusFilter !== 'all' ? 'No orders match your filters' : 'No phone orders found'}
            </div>
            {ordersArray.length === 0 && !loading && (
              <div className="no-orders-subtext">
                Orders will appear here once customers place phone orders.
              </div>
            )}
          </div>
        ) : (
          <table className="phone-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone Model</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="order-row">
                  <td className="order-id">#{order._id?.slice(-6) || 'N/A'}</td>
                  <td className="customer-info">
                    <div className="customer-name">{order.name || 'N/A'}</div>
                    <div className="customer-email">{order.email || 'N/A'}</div>
                    <div className="customer-phone">{order.phone || 'N/A'}</div>
                  </td>
                  <td className="phone-details">
                    <div className="phone-model">{order.model || 'N/A'}</div>
                    <div className="phone-specs">{order.color || 'N/A'} • {order.storage || 'N/A'}</div>
                  </td>
                  <td className="quantity">{order.quantity || 0}</td>
                  <td className="total-price">${(order.totalPrice || 0).toLocaleString()}</td>
                  <td className="status-cell">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="priority-cell">
                    <span className={`priority-badge priority-${order.priority}`}>
                      {order.priority === 'urgent' ? '🚀' : order.priority === 'express' ? '⚡' : '📅'}
                      {order.priority?.charAt(0).toUpperCase() + order.priority?.slice(1) || 'Normal'}
                    </span>
                  </td>
                  <td className="order-date">{formatDate(order.createdAt)}</td>
                  <td className="actions-cell">
                    <div className="actions-group">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="status-select"
                        disabled={loading}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="view-details-button"
                        title="View Details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📱 Order Details</h2>
              <button 
                className="modal-close"
                onClick={() => setShowOrderDetails(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-grid">
                <div className="detail-section">
                  <h3>👤 Customer Information</h3>
                  <div className="detail-item">
                    <strong>Name:</strong> {selectedOrder.name || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedOrder.email || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedOrder.phone || 'N/A'}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>📱 Phone Information</h3>
                  <div className="detail-item">
                    <strong>Model:</strong> {selectedOrder.model || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Color:</strong> {selectedOrder.color || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Storage:</strong> {selectedOrder.storage || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Quantity:</strong> {selectedOrder.quantity || 0}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💳 Payment & Delivery</h3>
                  <div className="detail-item">
                    <strong>Total Price:</strong> ${(selectedOrder.totalPrice || 0).toLocaleString()}
                  </div>
                  <div className="detail-item">
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'full' ? 'Full Payment' : 'Installment Plan'}
                  </div>
                  <div className="detail-item">
                    <strong>Delivery Method:</strong> {selectedOrder.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                  </div>
                  {selectedOrder.deliveryMethod === 'delivery' && (
                    <div className="detail-item">
                      <strong>Delivery Address:</strong> {selectedOrder.address || 'N/A'}
                    </div>
                  )}
                  {selectedOrder.deliveryMethod === 'pickup' && (
                    <>
                      <div className="detail-item">
                        <strong>Pickup Date:</strong> {selectedOrder.preferredDate || 'N/A'}
                      </div>
                      <div className="detail-item">
                        <strong>Pickup Time:</strong> {selectedOrder.preferredTime || 'N/A'}
                      </div>
                    </>
                  )}
                </div>

                <div className="detail-section">
                  <h3>📋 Order Status</h3>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedOrder.status), marginLeft: '10px' }}
                    >
                      {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Priority:</strong> 
                    <span className={`priority-badge priority-${selectedOrder.priority}`}>
                      {selectedOrder.priority === 'urgent' ? '🚀' : selectedOrder.priority === 'express' ? '⚡' : '📅'}
                      {selectedOrder.priority?.charAt(0).toUpperCase() + selectedOrder.priority?.slice(1) || 'Normal'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>

                {selectedOrder.message && (
                  <div className="detail-section full-width">
                    <h3>💬 Special Requests</h3>
                    <div className="detail-item">
                      <p className="message-text">{selectedOrder.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneOrdersManagement;