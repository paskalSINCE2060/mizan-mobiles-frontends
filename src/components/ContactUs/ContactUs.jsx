import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa";
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreeToPolicy: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        agreeToPolicy: false
      });
    }, 2000);
  };

  return (
    <div className="contact-us">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1 className="main-title">Get In Touch</h1>
          <p className="subtitle">
            Ready to start your next project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h2 className="section-title">
                <span className="title-accent"></span>
                Contact Information
              </h2>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon icon-location">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-text">
                    <h3>Visit us</h3>
                    <p>67 Wisteria Way, Croydon South<br />VIC 3136, Australia</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon icon-email">
                    <FaEnvelope />
                  </div>
                  <div className="contact-text">
                    <h3>Email us</h3>
                    <p>Our friendly team is here to help</p>
                    <a href="mailto:mizanmobile@gmail.com">mizanmobile@gmail.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon icon-phone">
                    <FaPhone />
                  </div>
                  <div className="contact-text">
                    <h3>Call us</h3>
                    <p>Mon-Fri from 8am to 5pm</p>
                    <a href="tel:+995555555555">(+995) 555-55-55-55</a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h3>Follow us</h3>
                <div className="social-icons">
                  <a href="https://facebook.com/mizanmobile" target="_blank" rel="noopener noreferrer" className="social-icon social-facebook">
                    <FaFacebook />
                  </a>
                  <a href="https://instagram.com/mizanmobile" target="_blank" rel="noopener noreferrer" className="social-icon social-instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://twitter.com/mizanmobile" target="_blank" rel="noopener noreferrer" className="social-icon social-twitter">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-card">
              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Tell us what we can help you with"
                  ></textarea>
                </div>

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToPolicy"
                    id="agreeToPolicy"
                    checked={formData.agreeToPolicy}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="agreeToPolicy">
                    I'd like to receive more information about the company. I understand and agree to the{' '}
                    <a href="/">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;