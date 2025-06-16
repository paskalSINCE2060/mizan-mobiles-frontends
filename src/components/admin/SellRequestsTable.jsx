import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSellPhoneRequests,
  updateRequestStatus,
  updateRequestQuote,
  deleteRequest,
  setFilters,
  selectSellPhoneRequests,
  selectSellPhonePagination,
  selectSellPhoneLoading,
  selectSellPhoneError
} from '../../slice/sellPhoneSlice';
import LoadingSpinner from './LoadingSpinner';
import RequestModal from './RequestModal';

const SellRequestsTable = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const requests = useSelector(selectSellPhoneRequests);
  const pagination = useSelector(selectSellPhonePagination);
  const loading = useSelector(selectSellPhoneLoading);
  const error = useSelector(selectSellPhoneError);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'quote' or 'status' or 'view'
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch requests on component mount and filter changes
  useEffect(() => {
    dispatch(fetchSellPhoneRequests({
      page: 1,
      limit: 20,
      status: statusFilter,
      search: searchTerm
    }));
  }, [dispatch, statusFilter, searchTerm]);

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

  // Open modal for quote, status update, or view details
  const openModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalType('');
  };

  // Handle quote submission
  const handleQuoteSubmit = async (quoteData) => {
    try {
      await dispatch(updateRequestQuote({
        id: selectedRequest._id,
        ...quoteData
      })).unwrap();
      
      closeModal();
      // Refetch requests to update the list
      dispatch(fetchSellPhoneRequests({
        page: pagination.currentPage,
        limit: 20,
        status: statusFilter,
        search: searchTerm
      }));
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  // Handle status update submission
  const handleStatusSubmit = async (statusData) => {
    try {
      await dispatch(updateRequestStatus({
        id: selectedRequest._id,
        ...statusData
      })).unwrap();
      
      closeModal();
      // Refetch requests to update the list
      dispatch(fetchSellPhoneRequests({
        page: pagination.currentPage,
        limit: 20,
        status: statusFilter,
        search: searchTerm
      }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Handle delete request
  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await dispatch(deleteRequest(requestId)).unwrap();
        // Refetch requests to update the list
        dispatch(fetchSellPhoneRequests({
          page: pagination.currentPage,
          limit: 20,
          status: statusFilter,
          search: searchTerm
        }));
      } catch (error) {
        console.error('Failed to delete request:', error);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'reviewed': return '#17a2b8';
      case 'quoted': return '#17a2b8';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#ffc107';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toFixed(2)}` : 'N/A';
  };

  // Get image URL - adjust this based on your backend setup
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/${imagePath}`;
  
};

  // Error display
  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#f8d7da', 
        color: '#721c24', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="sell-requests-table">
      <div className="admin-header">
        <h2>Sell Phone Requests Management</h2>
        <p>Manage and track phone selling requests</p>
      </div>

      {/* Filters */}
      <div className="admin-filters" style={{ marginBottom: '20px' }}>
        <div className="filter-tabs" style={{ marginBottom: '15px' }}>
          {['all', 'pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'].map(tab => (
            <button
              key={tab}
              className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange(tab)}
              style={{
                padding: '8px 16px',
                margin: '0 5px',
                border: '1px solid #ddd',
                backgroundColor: statusFilter === tab ? '#007bff' : 'white',
                color: statusFilter === tab ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'pending' && requests.filter(req => req.status === 'pending').length > 0 && (
                <span style={{
                  marginLeft: '5px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>
                  {requests.filter(req => req.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by brand, model, email, phone, or name..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '300px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* Requests Table */}
      {!loading && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Image</th>
                <th style={tableHeaderStyle}>Customer</th>
                <th style={tableHeaderStyle}>Contact</th>
                <th style={tableHeaderStyle}>Phone Details</th>
                <th style={tableHeaderStyle}>Color</th>
                <th style={tableHeaderStyle}>Expected Price</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Additional Details</th>
                <th style={tableHeaderStyle}>Submitted</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#666'
                  }}>
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request, index) => (
                  <tr key={request._id} style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}>
                    <td style={tableCellStyle}>
                      #{request._id?.slice(-6)}
                    </td>
                    
                    {/* Phone Image */}
                    <td style={tableCellStyle}>
                      {request.phoneImage ? (
                        <img
                          src={getImageUrl(request.phoneImage)}                          
                          alt="Phone"
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: '#666'
                        }}>
                          No Image
                        </div>
                      )}
                      <div style={{
                        display: 'none',
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#666'
                      }}>
                        Image Error
                      </div>
                    </td>
                    
                    {/* Customer Name */}
                    <td style={tableCellStyle}>
                      <div>
                        <strong>{request.fullName || 'N/A'}</strong>
                      </div>
                    </td>
                    
                    {/* Contact Info */}
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '12px' }}>
                        <div>{request.contactEmail || 'N/A'}</div>
                        <div style={{ color: '#666' }}>{request.contactPhone}</div>
                      </div>
                    </td>
                    
                    {/* Phone Details */}
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '12px' }}>
                        <strong>{request.brand} {request.model}</strong>
                        <div style={{ color: '#666' }}>
                          {request.storage}GB • {request.condition}
                        </div>
                        {request.hasCharger && (
                          <div style={{ color: '#28a745', fontSize: '11px' }}>
                            ✓ Includes charger
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Color */}
                    <td style={tableCellStyle}>
                      <span style={{
                        backgroundColor: '#e9ecef',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textTransform: 'capitalize'
                      }}>
                        {request.color || 'N/A'}
                      </span>
                    </td>
                    
                    {/* Expected Price */}
                    <td style={tableCellStyle}>
                      <strong style={{ color: '#28a745' }}>
                        {formatCurrency(request.expectedPrice)}
                      </strong>
                    </td>
                    
                    {/* Status */}
                    <td style={tableCellStyle}>
                      <span style={{
                        backgroundColor: getStatusColor(request.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textTransform: 'capitalize'
                      }}>
                        {request.status}
                      </span>
                    </td>
                    
                    {/* Additional Details */}
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '11px', maxWidth: '150px' }}>
                        {request.description ? (
                          <div>
                            <div style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              marginBottom: '2px'
                            }}>
                              {request.description.substring(0, 50)}
                              {request.description.length > 50 && '...'}
                            </div>
                            <button
                              onClick={() => openModal(request, 'view')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                fontSize: '10px',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              Read more
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#666' }}>No details</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Submitted Date */}
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openModal(request, 'view')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => openModal(request, 'quote')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          Quote
                        </button>
                        <button
                          onClick={() => openModal(request, 'status')}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          Status
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          gap: '10px'
        }}>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: pagination.currentPage === 1 ? '#f8f9fa' : 'white',
              cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Previous
          </button>
          
          <span style={{ color: '#666', fontSize: '14px' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              backgroundColor: pagination.currentPage === pagination.totalPages ? '#f8f9fa' : 'white',
              cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Request Modal */}
      {showModal && selectedRequest && (
        <RequestModal
          request={selectedRequest}
          type={modalType}
          onClose={closeModal}
          onQuoteSubmit={handleQuoteSubmit}
          onStatusSubmit={handleStatusSubmit}
        />
      )}
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  padding: '12px 8px',
  textAlign: 'left',
  borderBottom: '2px solid #dee2e6',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#495057'
};

const tableCellStyle = {
  padding: '12px 8px',
  fontSize: '13px',
  verticalAlign: 'top'
};

export default SellRequestsTable;