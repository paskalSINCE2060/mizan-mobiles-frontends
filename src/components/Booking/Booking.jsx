import React, { useState } from "react";
import "./Booking.css";

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    device: "",
    issue: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Details: ", formData);
    alert("Your booking has been submitted!");
  };

  return (
    <div className="booking-page-container">
      <h2>Book a Phone Repair</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="booking-page-input"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="booking-page-input"
        />
        <input
          type="text"
          name="device"
          placeholder="Device Model"
          value={formData.device}
          onChange={handleChange}
          required
          className="booking-page-input"
        />
        <textarea
          name="issue"
          placeholder="Describe the issue"
          value={formData.issue}
          onChange={handleChange}
          required
          className="booking-page-textarea"
        ></textarea>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="booking-page-input"
        />
        <button type="submit" className="booking-page-button">Book Now</button>
      </form>
    </div>
  );
};

export default BookingPage;