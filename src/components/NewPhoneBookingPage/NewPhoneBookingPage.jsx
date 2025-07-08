import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPhoneOrder, clearSubmitStatus } from '../../slice/phoneOrderSlice';
import './NewPhoneBooking.css';

const NewPhoneBookingPage = () => {
  const dispatch = useDispatch();
  const { submitLoading, submitError } = useSelector(state => state.phoneOrders);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    model: '',
    color: '',
    storage: '',
    quantity: 1,
    paymentMethod: 'full',
    deliveryMethod: 'pickup',
    address: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    budget: '',
    priority: 'standard'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const phoneModels = [
    { name: 'iPhone 15 Pro Max', price: 1199, colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'], storage: ['256GB', '512GB', '1TB'] },
    { name: 'iPhone 15 Pro', price: 999, colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'], storage: ['128GB', '256GB', '512GB', '1TB'] },
    { name: 'iPhone 15', price: 799, colors: ['Pink', 'Yellow', 'Green', 'Blue', 'Black'], storage: ['128GB', '256GB', '512GB'] },
    { name: 'Samsung Galaxy S25 Ultra', price: 1299, colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'], storage: ['256GB', '512GB', '1TB'] },
    { name: 'Samsung Galaxy S25+', price: 999, colors: ['Phantom Black', 'Cream', 'Violet', 'Green'], storage: ['256GB', '512GB'] },
    { name: 'Samsung Galaxy S25', price: 799, colors: ['Phantom Black', 'Cream', 'Violet', 'Green'], storage: ['128GB', '256GB', '512GB'] },
    { name: 'Google Pixel 9 Pro', price: 999, colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'], storage: ['128GB', '256GB', '512GB'] },
    { name: 'Google Pixel 9', price: 699, colors: ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'], storage: ['128GB', '256GB'] }
  ];

  const selectedPhone = phoneModels.find(phone => phone.name === formData.model);
  const basePrice = selectedPhone ? selectedPhone.price : 0;

  const priorityExtra = formData.priority === 'express' ? 50 : formData.priority === 'urgent' ? 100 : 0;
  const deliveryCharge = formData.deliveryMethod === 'delivery' ? 20 : 0;
  const totalPrice = (basePrice * formData.quantity) + priorityExtra + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      ...(name === 'model' && { color: '', storage: '' })
    }));

    // Clear submit error when user starts typing
    if (submitError) {
      dispatch(clearSubmitStatus());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.model || !formData.color || !formData.storage) {
      // You might want to add a local error state for validation errors
      return;
    }

    if (formData.deliveryMethod === 'delivery' && !formData.address.trim()) {
      return;
    }

    if (formData.deliveryMethod === 'pickup' && (!formData.preferredDate || !formData.preferredTime)) {
      return;
    }

    const orderData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      model: formData.model,
      color: formData.color,
      storage: formData.storage,
      quantity: Number(formData.quantity),
      paymentMethod: formData.paymentMethod,
      deliveryMethod: formData.deliveryMethod,
      address: formData.deliveryMethod === 'delivery' ? formData.address : '',
      preferredDate: formData.deliveryMethod === 'pickup' ? formData.preferredDate : '',
      preferredTime: formData.deliveryMethod === 'pickup' ? formData.preferredTime : '',
      message: formData.message,
      budget: formData.budget,
      priority: formData.priority,
      totalPrice,
    };

    console.log('📤 Sending phone booking data:', orderData);

    try {
      await dispatch(createPhoneOrder(orderData)).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      console.error('❌ Booking error:', error);
      // Error is already handled by Redux
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      model: '',
      color: '',
      storage: '',
      quantity: 1,
      paymentMethod: 'full',
      deliveryMethod: 'pickup',
      address: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
      budget: '',
      priority: 'standard'
    });
    dispatch(clearSubmitStatus());
  };

  if (isSubmitted) {
    return (
      <div className="new-phone-booking-success-container">
        <div className="new-phone-booking-success-card">
          <div className="new-phone-booking-success-icon">🎉</div>
          <h2 className="new-phone-booking-success-title">Order Confirmed!</h2>
          <p className="new-phone-booking-success-text">
            Thank you for your order, <strong>{formData.name}</strong>!
          </p>

          <div className="new-phone-booking-order-summary">
            <h3>📱 Order Summary</h3>
            <p><strong>Phone:</strong> {formData.model}</p>
            <p><strong>Color:</strong> {formData.color}</p>
            <p><strong>Storage:</strong> {formData.storage}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Total Price:</strong> <span className="price">${totalPrice.toLocaleString()}</span></p>
            <p><strong>Payment:</strong> {formData.paymentMethod === 'full' ? 'Full Payment' : 'Installment Plan'}</p>
            <p><strong>Delivery:</strong> {formData.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
            {formData.deliveryMethod === 'pickup' && (
              <p><strong>Pickup Date:</strong> {formData.preferredDate} at {formData.preferredTime}</p>
            )}
            {formData.deliveryMethod === 'delivery' && (
              <p><strong>Delivery Address:</strong> {formData.address}</p>
            )}
            <p><strong>Priority:</strong> {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}</p>
          </div>

          <div className="new-phone-booking-next-steps">
            <p className="new-phone-booking-next-steps-title">🎯 What's Next?</p>
            <p className="new-phone-booking-next-steps-text">
              We've sent a confirmation email to <strong>{formData.email}</strong>.
              Our team will contact you within 24 hours to process your order and arrange
              {formData.deliveryMethod === 'pickup' ? ' pickup details' : ' delivery'}.
            </p>
          </div>

          <button
            className="new-phone-booking-new-order-btn"
            onClick={resetForm}
          >
            📱 Order Another Phone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-phone-booking-container">
      <div className="new-phone-booking-form-wrapper">
        <header className="new-phone-booking-header">
          <h1 className="new-phone-booking-title">📱 New Phone Booking</h1>
          <p className="new-phone-booking-subtitle">Order your dream phone today</p>
        </header>

        {submitError && (
          <div className="new-phone-booking-error" role="alert" aria-live="assertive">
            <span>❌ </span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <section className="new-phone-booking-section personal">
            <h3 className="new-phone-booking-section-title">👤 Personal Information</h3>

            <div className="new-phone-booking-grid">
              <div className="new-phone-booking-form-group">
                <label htmlFor="name" className="new-phone-booking-label">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  disabled={submitLoading}
                  className="new-phone-booking-input"
                />
              </div>

              <div className="new-phone-booking-form-group">
                <label htmlFor="email" className="new-phone-booking-label">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={submitLoading}
                  className="new-phone-booking-input"
                />
              </div>
            </div>

            <div className="new-phone-booking-form-group">
              <label htmlFor="phone" className="new-phone-booking-label">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                disabled={submitLoading}
                className="new-phone-booking-input phone"
              />
            </div>
          </section>

          {/* Phone Selection Section */}
          <section className="new-phone-booking-section phone-selection">
            <h3 className="new-phone-booking-section-title">📱 Phone Selection</h3>

            <div className="new-phone-booking-grid">
              <div className="new-phone-booking-form-group">
                <label htmlFor="model" className="new-phone-booking-label">Phone Model *</label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                  className="new-phone-booking-select"
                >
                  <option value="">Select a phone model</option>
                  {phoneModels.map((phone, index) => (
                    <option key={index} value={phone.name}>
                      {phone.name} - ${phone.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPhone && (
                <div className="new-phone-booking-form-group">
                  <label htmlFor="color" className="new-phone-booking-label">Color *</label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    disabled={submitLoading}
                    className="new-phone-booking-select"
                  >
                    <option value="">Select color</option>
                    {selectedPhone.colors.map((color, index) => (
                      <option key={index} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedPhone && (
              <div className="new-phone-booking-grid small">
                <div className="new-phone-booking-form-group">
                  <label htmlFor="storage" className="new-phone-booking-label">Storage *</label>
                  <select
                    id="storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    required
                    disabled={submitLoading}
                    className="new-phone-booking-select"
                  >
                    <option value="">Select storage</option>
                    {selectedPhone.storage.map((storage, index) => (
                      <option key={index} value={storage}>{storage}</option>
                    ))}
                  </select>
                </div>

                <div className="new-phone-booking-form-group">
                  <label htmlFor="quantity" className="new-phone-booking-label">Quantity *</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    disabled={submitLoading}
                    className="new-phone-booking-input"
                  />
                </div>
              </div>
            )}

            {totalPrice > 0 && (
              <div className="new-phone-booking-price-display" aria-live="polite">
                <h4 className="new-phone-booking-total-price">
                  💰 Total: ${totalPrice.toLocaleString()}
                </h4>
              </div>
            )}
          </section>

          {/* Payment & Delivery Section */}
          <section className="new-phone-booking-section payment-delivery">
            <h3 className="new-phone-booking-section-title">💳 Payment & Delivery</h3>

            <div className="new-phone-booking-grid">
              <div className="new-phone-booking-form-group">
                <label htmlFor="paymentMethod" className="new-phone-booking-label">Payment Method *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                  className="new-phone-booking-select"
                >
                  <option value="full">💰 Full Payment</option>
                  <option value="installment">📅 Installment Plan</option>
                </select>
              </div>

              <div className="new-phone-booking-form-group">
                <label htmlFor="deliveryMethod" className="new-phone-booking-label">Delivery Method *</label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                  className="new-phone-booking-select"
                >
                  <option value="pickup">🏪 Store Pickup (Free)</option>
                  <option value="delivery">🚚 Home Delivery (+$20)</option>
                </select>
              </div>
            </div>

            {formData.deliveryMethod === 'delivery' && (
              <div className="new-phone-booking-address-field">
                <label htmlFor="address" className="new-phone-booking-label">Delivery Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required={formData.deliveryMethod === 'delivery'}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  disabled={submitLoading}
                  className="new-phone-booking-textarea"
                />
              </div>
            )}

            {formData.deliveryMethod === 'pickup' && (
              <div className="new-phone-booking-grid small">
                <div className="new-phone-booking-form-group">
                  <label htmlFor="preferredDate" className="new-phone-booking-label">Preferred Pickup Date *</label>
                  <input
                    id="preferredDate"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required={formData.deliveryMethod === 'pickup'}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={submitLoading}
                    className="new-phone-booking-input"
                  />
                </div>

                <div className="new-phone-booking-form-group">
                  <label htmlFor="preferredTime" className="new-phone-booking-label">Preferred Time *</label>
                  <input
                    id="preferredTime"
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required={formData.deliveryMethod === 'pickup'}
                    disabled={submitLoading}
                    className="new-phone-booking-input"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Additional Information */}
          <section className="new-phone-booking-section additional">
            <h3 className="new-phone-booking-section-title">📝 Additional Information</h3>

            <div className="new-phone-booking-form-group">
              <label htmlFor="message" className="new-phone-booking-label">Special Requests or Questions</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requests, questions, or additional information..."
                rows="4"
                disabled={submitLoading}
                className="new-phone-booking-textarea"
              />
            </div>

            <div className="new-phone-booking-form-group">
              <label htmlFor="priority" className="new-phone-booking-label">Order Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={submitLoading}
                className="new-phone-booking-select priority"
              >
                <option value="standard">📅 Standard (3-5 business days)</option>
                <option value="express">⚡ Express (1-2 business days) +$50</option>
                <option value="urgent">🚀 Urgent (Same day) +$100</option>
              </select>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitLoading}
            className="new-phone-booking-submit-btn"
          >
            {submitLoading ? (
              <>
                <span className="new-phone-booking-spinner"></span>
                Processing Order...
              </>
            ) : (
              <>
                🛒 Confirm Order
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPhoneBookingPage;