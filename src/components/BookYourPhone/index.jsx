// PhoneBookingPage.jsx
import React, { useState } from 'react';
import './style.css';

const PhoneBookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    model: '',
    date: '',
    time: '',
    message: '',
    urgency: 'medium' // Add urgency with default value
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const phoneModels = [
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15',
    'Samsung Galaxy S25 Ultra',
    'Samsung Galaxy S25+',
    'Samsung Galaxy S25',
    'Google Pixel 9 Pro',
    'Google Pixel 9'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('📤 Sending booking data:', formData);
      
      // Send data to your backend API
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      console.log('📥 Backend response:', result);
      
      if (response.ok && result.success) {
        console.log('✅ Booking successful!');
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      setError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="booking-phone container booking-phone success-container">
        <div className="booking-phone success-message">
          <h2>✅ Booking Confirmed!</h2>
          <p>Thank you for booking with us, <strong>{formData.name}</strong>.</p>
          <p>📧 We've sent a confirmation to <strong>{formData.email}</strong>.</p>
          <p>📱 Your phone model: <strong>{formData.model}</strong></p>
          <p>📅 Appointment: <strong>{formData.date} at {formData.time}</strong></p>
          <p>⚡ Urgency Level: <strong style={{
            color: formData.urgency === 'high' ? '#e74c3c' : 
                   formData.urgency === 'medium' ? '#f39c12' : '#27ae60'
          }}>
            {formData.urgency === 'high' ? '🔴 HIGH PRIORITY' : 
             formData.urgency === 'medium' ? '🟡 MEDIUM PRIORITY' : '🟢 LOW PRIORITY'}
          </strong></p>
          <div className="success-info">
            <p>🎯 <strong>What happens next?</strong></p>
            <p>Our admin team has been notified and will contact you within 24 hours to confirm your appointment details.</p>
          </div>
          <button 
            className="booking-phone btn" 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                model: '',
                date: '',
                time: '',
                message: '',
                urgency: 'medium'
              });
            }}
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="booking-phone container">
      <header className="booking-phone header">
        <h1>Phone Repair Booking</h1>
        <p>Schedule your phone repair appointment</p>
      </header>
      
      {error && (
        <div className="error-message" style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          ❌ {error}
        </div>
      )}
      
      <form className="booking-phone booking-form" onSubmit={handleSubmit}>
        <div className="booking-phone form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>
        
        <div className="booking-phone form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        
        <div className="booking-phone form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
        </div>
        
        <div className="booking-phone form-group">
          <label htmlFor="model">Phone Model *</label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Select a phone model</option>
            {phoneModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <div className="booking-phone form-group">
          <label htmlFor="urgency">Repair Urgency *</label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              background: formData.urgency === 'high' ? '#ffebee' : 
                         formData.urgency === 'medium' ? '#fff3e0' : '#e8f5e8'
            }}
          >
            <option value="low">🟢 Low - Not urgent (within 7 days)</option>
            <option value="medium">🟡 Medium - Moderately urgent (within 3 days)</option>
            <option value="high">🔴 High - Very urgent (ASAP/same day)</option>
          </select>
          <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            {formData.urgency === 'high' && '⚡ High priority bookings may incur additional fees'}
            {formData.urgency === 'medium' && '📅 We\'ll aim to schedule within 3 days'}
            {formData.urgency === 'low' && '📅 Flexible scheduling within a week'}
          </small>
        </div>
        
        <div className="booking-phone form-row">
          <div className="booking-phone form-group">
            <label htmlFor="date">Preferred Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              disabled={isLoading}
            />
          </div>
          
          <div className="booking-phone form-group">
            <label htmlFor="time">Preferred Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="booking-phone form-group">
          <label htmlFor="message">Describe the Problem</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="What's wrong with your phone? (e.g., cracked screen, battery issues, etc.)"
            rows="3"
            disabled={isLoading}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="booking-phone btn"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '📤 Submitting...' : '📅 Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default PhoneBookingPage;