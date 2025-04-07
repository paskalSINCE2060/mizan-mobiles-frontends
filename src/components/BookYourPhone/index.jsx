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
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
      <div className="container success-container">
        <div className="success-message">
          <h2>Booking Confirmed!</h2>
          <p>Thank you for booking with us, {formData.name}.</p>
          <p>We've sent a confirmation to {formData.email}.</p>
          <p>Your phone model: {formData.model}</p>
          <p>Appointment: {formData.date} at {formData.time}</p>
          <button 
            className="btn" 
            onClick={() => setIsSubmitted(false)}
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <header className="header">
        <h1>Phone Booking Service</h1>
        <p>Reserve your new phone today</p>
      </header>
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="model">Phone Model</label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          >
            <option value="">Select a phone model</option>
            {phoneModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Preferred Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Additional Notes</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any additional requirements or questions?"
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="btn">Confirm Booking</button>
      </form>
      
    </div>
  );
};

export default PhoneBookingPage;