// frontend/src/components/admin/CheckoutOrdersTab.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCheckoutOrders,
  updateOrderStatus,
  selectCheckoutOrders,
  selectCheckoutOrdersPagination,
  selectCheckoutOrdersLoading,
  selectCheckoutOrdersError,
} from '../../slice/checkoutOrdersSlice';

const CheckoutOrdersTab = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectCheckoutOrders);
  const pagination = useSelector(selectCheckoutOrdersPagination);
  const loading = useSelector(selectCheckoutOrdersLoading);
  const error = useSelector(selectCheckoutOrdersError);

  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    orderStatus: '',
    paymentStatus: '',
    adminNotes: '',
  });

  useEffect(() => {
    dispatch(fetchCheckoutOrders({
      page: 1,
      limit: 20,
      status: statusFilter,
      search: searchTerm,
    }));
  }, [dispatch, statusFilter, searchTerm]);

  const handlePageChange = (page) => {
    dispatch(fetchCheckoutOrders({
      page,
      limit: 20,
      status: statusFilter,
      search: searchTerm,
    }));
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setStatusForm({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      adminNotes: order.adminNotes || '',
    });
    setShowModal(true);
  };

  const handleStatusSubmit = async () => {
    try {
      await dispatch(updateOrderStatus({
        orderId: selectedOrder._id,
        orderStatus: statusForm.orderStatus,
        paymentStatus: statusForm.paymentStatus,
        adminNotes: statusForm.adminNotes,
      }));
      setShowModal(false);
      setSelectedOrder(null);
      // Refresh the orders list
      dispatch(fetchCheckoutOrders({
        page: pagination.currentPage,
        limit: 20,
        status: statusFilter,
        search: searchTerm,
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#fbbf24';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#10b981';
      case 'failed': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash_on_delivery': return '💵';
      case 'card': return '💳';
      default: return '💰';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading checkout orders...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Orders Management</h2>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '25px' 
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#495057' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Orders</div>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
            {orders.filter(o => o.orderStatus === 'pending').length}
          </div>
          <div style={{ fontSize: '14px', color: '#856404' }}>Pending</div>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d1ecf1', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #bee5eb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
            {orders.filter(o => o.paymentMethod === 'cash_on_delivery').length}
          </div>
          <div style={{ fontSize: '14px', color: '#0c5460' }}>COD Orders</div>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
            {orders.filter(o => o.orderStatus === 'delivered').length}
          </div>
          <div style={{ fontSize: '14px', color: '#155724' }}>Delivered</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Order Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Payment Method:</label>
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          >
            <option value="all">All Methods</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Order Details
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Customer
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Products
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Payment
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Date
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>
                      {order.orderNumber || order._id.slice(-8)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      ID: {order._id.slice(-8)}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div>
                    <strong>{order.customerDetails.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{order.customerDetails.email}</small>
                    {order.customerDetails.phone && (
                      <>
                        <br />
                        <small style={{ color: '#666' }}>📞 {order.customerDetails.phone}</small>
                      </>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div>
                    {order.products.slice(0, 2).map((product, index) => (
                      <div key={index} style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>
                          {product.name} x{product.quantity}
                        </span>
                      </div>
                    ))}
                    {order.products.length > 2 && (
                      <small style={{ color: '#666' }}>
                        +{order.products.length - 2} more
                      </small>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                      <span style={{ fontSize: '12px' }}>
                        {order.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Card'}
                      </span>
                    </div>
                    <div>
                      <strong>{formatCurrency(order.pricing.total)}</strong>
                    </div>
                    <div>
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getPaymentStatusColor(order.paymentStatus),
                        }}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <small>{formatDate(order.createdAt)}</small>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleUpdateStatus(order)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
              backgroundColor: pagination.hasPrev ? 'white' : '#f5f5f5',
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '8px 16px', color: '#666' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
              backgroundColor: pagination.hasNext ? 'white' : '#f5f5f5',
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Status Update Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              Update Order - {selectedOrder?.orderNumber || selectedOrder?._id.slice(-8)}
            </h3>

            {/* Order Details */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '10px', color: '#555' }}>Order Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <div>
                  <strong>Customer:</strong> {selectedOrder?.customerDetails.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder?.customerDetails.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedOrder?.customerDetails.phone || 'N/A'}
                </div>
                <div>
                  <strong>Payment Method:</strong> 
                  <span style={{ marginLeft: '5px' }}>
                    {getPaymentMethodIcon(selectedOrder?.paymentMethod)} 
                    {selectedOrder?.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card Payment'}
                  </span>
                </div>
                <div>
                  <strong>Total:</strong> {formatCurrency(selectedOrder?.pricing.total)}
                </div>
                <div>
                  <strong>Order Date:</strong> {formatDate(selectedOrder?.createdAt)}
                </div>
              </div>
              
              {/* Products */}
              <div style={{ marginTop: '15px' }}>
                <strong>Products:</strong>
                <div style={{ marginTop: '5px' }}>
                  {selectedOrder?.products.map((product, index) => (
                    <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
                      • {product.name} x{product.quantity} - {formatCurrency(product.price * product.quantity)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop: '15px' }}>
                <strong>Delivery Address:</strong>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  {selectedOrder?.customerDetails.address}<br />
                  {selectedOrder?.customerDetails.city}, {selectedOrder?.customerDetails.zipCode}
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder?.customerDetails.notes && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Customer Notes:</strong>
                  <div style={{ fontSize: '12px', marginTop: '5px', fontStyle: 'italic' }}>
                    "{selectedOrder.customerDetails.notes}"
                  </div>
                </div>
              )}
            </div>

            {/* Status Update Form */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Order Status:
                  </label>
                  <select
                    value={statusForm.orderStatus}
                    onChange={(e) => setStatusForm({ ...statusForm, orderStatus: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Payment Status:
                  </label>
                  <select
                    value={statusForm.paymentStatus}
                    onChange={(e) => setStatusForm({ ...statusForm, paymentStatus: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {selectedOrder?.paymentMethod === 'cash_on_delivery' && (
                    <small style={{ color: '#666', fontSize: '11px' }}>
                      Mark as 'Paid' when cash is collected
                    </small>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Admin Notes:
                </label>
                <textarea
                  value={statusForm.adminNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
                  placeholder="Add any notes about this order status update..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
          <h3>No orders found</h3>
          <p>
            {statusFilter !== 'all' || searchTerm 
              ? 'No orders match your current filters.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutOrdersTab;