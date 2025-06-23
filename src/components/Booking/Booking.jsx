import React, { useState } from "react";
import "./Booking.css";

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", // Added email field
    device: "",
    issue: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!formData.name || !formData.phone || !formData.device || !formData.issue || !formData.date) {
      setMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setMessage("Please select a future date for your booking");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Your booking has been submitted successfully! We'll contact you soon to confirm your appointment.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          device: "",
          issue: "",
          date: "",
        });
      } else {
        setMessage(data.message || "Error submitting booking");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Error submitting booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="booking-container">
      <h2>Book a Phone Repair</h2>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
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
          <label htmlFor="phone">Phone Number *</label>
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
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="device">Device Model *</label>
          <input
            type="text"
            id="device"
            name="device"
            value={formData.device}
            onChange={handleChange}
            required
            placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23"
          />
        </div>

        <div className="form-group">
          <label htmlFor="issue">Issue Description *</label>
          <textarea
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
            placeholder="Describe the problem with your device"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Preferred Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={getTodayDate()}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Book Now"}
        </button>
      </form>

      <div className="booking-info">
        <h3>What happens next?</h3>
        <ol>
          <li>We'll review your booking request</li>
          <li>Our team will contact you to confirm the appointment</li>
          <li>We'll provide an estimated cost for the repair</li>
          <li>Bring your device at the scheduled time</li>
        </ol>
      </div>
    </div>
  );
};

export default BookingPage;