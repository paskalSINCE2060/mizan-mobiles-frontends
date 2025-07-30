// frontend/src/components/UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    fetchOrders(currentPage);
  }, [currentPage, navigate]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/checkout-orders/user/orders?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Something went wrong while fetching your orders');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="user-orders-container">
        <div className="user-orders-header">
          <div className="container">
            <h1>My Orders</h1>
            <p>Track and manage your order history</p>
          </div>
        </div>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="loading">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <header className="user-orders-header">
        <div className="container">
          <h1>My Orders</h1>
          <p>Track and manage your order history</p>
        </div>
      </header>

      <div className="container">
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>No Orders Yet</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card" style={{
                  backgroundColor: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                  {/* Order Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e9ecef',
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                        Order #{order.orderNumber || order._id.slice(-8)}
                      </h3>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: getStatusColor(order.orderStatus),
                          }}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: getPaymentStatusColor(order.paymentStatus),
                          }}
                        >
                          Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '20px',
                    alignItems: 'start',
                  }}>
                    {/* Products */}
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '16px' }}>
                        Items Ordered
                      </h4>
                      <div className="order-products">
                        {order.products.map((product, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 0',
                            borderBottom: index < order.products.length - 1 ? '1px solid #f0f0f0' : 'none',
                          }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #e9ecef',
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>
                                {product.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Quantity: {product.quantity} × {formatCurrency(product.price)}
                              </div>
                              {product.specialOffer && (
                                <div style={{
                                  fontSize: '11px',
                                  color: '#28a745',
                                  fontWeight: '500',
                                  marginTop: '2px',
                                }}>
                                  🎉 {product.specialOffer.title}
                                </div>
                              )}
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                              {formatCurrency(product.price * product.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Details */}
                    <div>
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                        marginBottom: '15px',
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
                          Order Summary
                        </h4>
                        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Subtotal:</span>
                            <span>{formatCurrency(order.pricing.subtotal)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Shipping:</span>
                            <span>{formatCurrency(order.pricing.shipping)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Tax:</span>
                            <span>{formatCurrency(order.pricing.tax)}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            paddingTop: '8px',
                            borderTop: '1px solid #dee2e6',
                          }}>
                            <span>Total:</span>
                            <span>{formatCurrency(order.pricing.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment & Delivery Info */}
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
                          Payment & Delivery
                        </h4>
                        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Payment Method:</strong><br />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              {order.paymentMethod === 'cash_on_delivery' ? '💵' : '💳'}
                              {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card Payment'}
                            </span>
                          </div>
                          <div>
                            <strong>Delivery Address:</strong><br />
                            <span style={{ color: '#666', marginTop: '2px', display: 'block' }}>
                              {order.customerDetails.address}<br />
                              {order.customerDetails.city}, {order.customerDetails.zipCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes (if any) */}
                  {order.adminNotes && (
                    <div style={{
                      marginTop: '15px',
                      padding: '12px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px',
                      borderLeft: '4px solid #2196f3',
                    }}>
                      <strong style={{ fontSize: '12px', color: '#1976d2' }}>Update from Store:</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#333' }}>
                        {order.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e9ecef',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end',
                  }}>
                    {order.orderStatus === 'pending' && (
                      <span style={{
                        fontSize: '12px',
                        color: '#666',
                        fontStyle: 'italic',
                      }}>
                        We'll contact you soon to confirm your order
                      </span>
                    )}
                    {order.orderStatus === 'processing' && (
                      <span style={{
                        fontSize: '12px',
                        color: '#2196f3',
                        fontWeight: '500',
                      }}>
                        Your order is being prepared
                      </span>
                    )}
                    {order.orderStatus === 'shipped' && (
                      <span style={{
                        fontSize: '12px',
                        color: '#9c27b0',
                        fontWeight: '500',
                      }}>
                        Your order is on the way!
                      </span>
                    )}
                    {order.orderStatus === 'delivered' && (
                      <span style={{
                        fontSize: '12px',
                        color: '#4caf50',
                        fontWeight: '500',
                      }}>
                        ✅ Order delivered successfully
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px',
                padding: '20px',
              }}>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                    backgroundColor: pagination.hasPrev ? 'white' : '#f5f5f5',
                    color: pagination.hasPrev ? '#333' : '#999',
                  }}
                >
                  Previous
                </button>
                
                <span style={{ padding: '8px 16px', color: '#666', fontSize: '14px' }}>
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
                    color: pagination.hasNext ? '#333' : '#999',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrders;