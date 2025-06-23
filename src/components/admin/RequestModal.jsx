import React, { useState, useEffect } from 'react';

const RequestModal = ({ request, type, onClose, onQuoteSubmit, onStatusSubmit }) => {
  const [quoteForm, setQuoteForm] = useState({
    estimatedPrice: '',
    adminNotes: '',
    status: 'quoted'
  });

  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });

  useEffect(() => {
    if (request) {
      if (type === 'quote') {
        setQuoteForm({
          estimatedPrice: request.estimatedPrice || '',
          adminNotes: request.adminNotes || '',
          status: 'quoted'
        });
      } else if (type === 'status') {
        setStatusForm({
          status: request.status || 'pending',
          adminNotes: request.adminNotes || ''
        });
      }
    }
  }, [request, type]);

  const handleQuoteFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusFormChange = (e) => {
    const { name, value } = e.target;
    setStatusForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    onQuoteSubmit(quoteForm);
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    onStatusSubmit(statusForm);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toFixed(2)}` : 'N/A';
  };

  // Get image URL - adjust this based on your backend setup
  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
};

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107'; // yellow
      case 'reviewed':
        return '#17a2b8'; // blue
      case 'quoted':
        return '#007bff'; // dark blue
      case 'accepted':
        return '#28a745'; // green
      case 'rejected':
        return '#dc3545'; // red
      case 'completed':
        return '#6c757d'; // gray
      default:
        return '#6c757d'; // fallback gray
    }
  };

  if (!request) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '15px'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>
            {type === 'view' && 'Request Details'}
            {type === 'quote' && 'Update Quote'}
            {type === 'status' && 'Update Status'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* Request Details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {/* Customer Information */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Customer Information</h4>
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Name:</strong> {request.fullName || request.customerName || 'N/A'}<br />
                <strong>Email:</strong> {request.contactEmail || 'N/A'}<br />
                <strong>Phone:</strong> {request.contactPhone || 'N/A'}
              </div>
            </div>

            {/* Phone Details */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Phone Details</h4>
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <strong>Brand:</strong> {request.brand || 'N/A'}<br />
                <strong>Model:</strong> {request.model || 'N/A'}<br />
                <strong>Storage:</strong> {request.storage ? `${request.storage}GB` : 'N/A'}<br />
                <strong>Condition:</strong> {request.condition || 'N/A'}<br />
                <strong>Color:</strong> {request.color || 'N/A'}
              </div>
            </div>
          </div>

          {/* Pricing and Status Information */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Pricing & Status</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <strong>Expected Price:</strong> {formatCurrency(request.expectedPrice)}<br />
                  <strong>Estimated Price:</strong> {formatCurrency(request.estimatedPrice)}<br />
                  <strong>Includes Charger:</strong> {request.hasCharger ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Status:</strong> <span style={{
                    backgroundColor: getStatusColor(request.status),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {request.status}
                  </span><br />
                  <strong>Submitted:</strong> {formatDate(request.createdAt)}<br />
                  <strong>Last Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {request.description && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Additional Details</h4>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                {request.description}
              </p>
            </div>
          )}

          {/* Phone Image */}
          {request.phoneImage && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Phone Image</h4>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={getImageUrl(request.phoneImage)}
                  alt="Phone"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    height: 'auto',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{
                  display: 'none',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Failed to load image
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes (if available) */}
          {request.adminNotes && (
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>Admin Notes</h4>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#856404' }}>
                {request.adminNotes}
              </p>
            </div>
          )}
        </div>

        {/* Form Section - Only show for quote and status types */}
        {(type === 'quote' || type === 'status') && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            {type === 'quote' && (
              <form onSubmit={handleQuoteSubmit}>
                <h4 style={{ marginBottom: '15px', color: '#495057' }}>Update Quote</h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Estimated Price ($):
                  </label>
                  <input
                    type="number"
                    name="estimatedPrice"
                    value={quoteForm.estimatedPrice}
                    onChange={handleQuoteFormChange}
                    step="0.01"
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter estimated price"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Admin Notes:
                  </label>
                  <textarea
                    name="adminNotes"
                    value={quoteForm.adminNotes}
                    onChange={handleQuoteFormChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Add any notes about the quote or phone condition..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Update Quote
                  </button>
                </div>
              </form>
            )}

            {type === 'status' && (
              <form onSubmit={handleStatusSubmit}>
                <h4 style={{ marginBottom: '15px', color: '#495057' }}>Update Status</h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Status:
                  </label>
                  <select
                    name="status"
                    value={statusForm.status}
                    onChange={handleStatusFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="quoted">Quoted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Admin Notes:
                  </label>
                  <textarea
                    name="adminNotes"
                    value={statusForm.adminNotes}
                    onChange={handleStatusFormChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Add any notes about the status change..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Update Status
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View Only Footer */}
        {type === 'view' && (
          <div style={{ 
            marginTop: '20px', 
            borderTop: '1px solid #eee', 
            paddingTop: '20px',
            textAlign: 'right'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestModal;