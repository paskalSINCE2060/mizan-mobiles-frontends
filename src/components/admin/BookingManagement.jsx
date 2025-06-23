import React, { useState } from 'react';

const BookingManagement = ({ bookings, updateBookingStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.deviceModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.repairType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'preferredDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fff3cd',
      confirmed: '#d4edda',
      'in-progress': '#cce5ff',
      completed: '#d1ecf1',
      cancelled: '#f8d7da'
    };
    return colors[status] || '#f8f9fa';
  };

  const getStatusTextColor = (status) => {
    const colors = {
      pending: '#856404',
      confirmed: '#155724',
      'in-progress': '#004085',
      completed: '#0c5460',
      cancelled: '#721c24'
    };
    return colors[status] || '#495057';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      urgent: '#dc3545'
    };
    return colors[urgency] || '#6c757d';
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Repair Bookings Management</h2>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '200px'
            }}
          />
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="createdAt">Date Created</option>
            <option value="preferredDate">Preferred Date</option>
            <option value="customerName">Customer Name</option>
            <option value="urgency">Urgency</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px',
        marginBottom: '25px'
      }}>
        {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => {
          const count = bookings.filter(b => b.status === status).length;
          return (
            <div
              key={status}
              style={{
                backgroundColor: getStatusColor(status),
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #dee2e6'
              }}
            >
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: getStatusTextColor(status),
                marginBottom: '5px'
              }}>
                {count}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: getStatusTextColor(status),
                textTransform: 'capitalize'
              }}>
                {status.replace('-', ' ')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings List */}
      {sortedBookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>No bookings found</h3>
          <p style={{ margin: 0 }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No repair bookings have been submitted yet'
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Header Row */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {booking.customerName}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Booking ID: {booking._id?.slice(-8) || 'N/A'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* Urgency Badge */}
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: getUrgencyColor(booking.urgency),
                    color: 'white',
                    textTransform: 'uppercase'
                  }}>
                    {booking.urgency}
                  </span>
                  
                  {/* Status Badge */}
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(booking.status),
                    color: getStatusTextColor(booking.status),
                    textTransform: 'capitalize'
                  }}>
                    {booking.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <strong>Contact Information:</strong>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    📧 {booking.email}<br/>
                    📱 {booking.phone}
                  </div>
                </div>
                
                <div>
                  <strong>Device Details:</strong>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    📱 {booking.deviceModel}<br/>
                    🔧 {booking.repairType}
                  </div>
                </div>
                
                <div>
                  <strong>Timing:</strong>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    📅 Preferred: {formatDate(booking.preferredDate)}<br/>
                    📝 Created: {formatDate(booking.createdAt)}
                  </div>
                </div>
                
                {booking.estimatedCost && (
                  <div>
                    <strong>Estimated Cost:</strong>
                    <div style={{ 
                      marginTop: '5px', 
                      fontSize: '16px', 
                      color: '#28a745',
                      fontWeight: 'bold'
                    }}>
                      ${booking.estimatedCost}
                    </div>
                  </div>
                )}
              </div>

              {/* Issue Description */}
              {booking.issueDescription && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Issue Description:</strong>
                  <div style={{
                    marginTop: '5px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#495057',
                    borderLeft: '3px solid #007bff'
                  }}>
                    {booking.issueDescription}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {booking.adminNotes && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Admin Notes:</strong>
                  <div style={{
                    marginTop: '5px',
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#856404',
                    borderLeft: '3px solid #ffc107'
                  }}>
                    {booking.adminNotes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✅ Confirm Booking
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </>
                )}
                
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(booking._id, 'in-progress')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🔧 Start Repair
                  </button>
                )}
                
                {booking.status === 'in-progress' && (
                  <button
                    onClick={() => updateBookingStatus(booking._id, 'completed')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✅ Mark Complete
                  </button>
                )}

                {/* Contact Customer Button */}
                <a
                  href={`mailto:${booking.email}?subject=Regarding your repair booking (${booking._id?.slice(-8)})`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    display: 'inline-block'
                  }}
                >
                  📧 Contact Customer
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;