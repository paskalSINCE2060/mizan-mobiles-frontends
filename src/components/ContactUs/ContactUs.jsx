import './ContactUs.css';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone, FaMobile, FaLaptop, FaTools } from "react-icons/fa";

const ContactUs = () => {
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
          <h1 className="main-title">Find Our Store</h1>
          <p className="subtitles">
            <FaMobile className="header-icons" />
            <FaLaptop className="header-icons" />
            <FaTools className="header-icons" />
            <br />
            Your trusted partner for mobile phones, laptops, buying, selling, and professional repair services. Visit us today for all your tech needs!
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
                    <p>Al Karama Road, Near LuLu Hypermarket, <br />Shop No 6, Ajman-U.A.E</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon icon-email">
                    <FaEnvelope />
                  </div>
                  <div className="contact-text">
                    <h3>Email us</h3>
                    <p>Our friendly team is here to help</p>
                    <a href="mailto:mizanmobile999@gmail.com">mizanmobile999@gmail.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon icon-phone">
                    <FaPhone />
                  </div>
                  <div className="contact-text">
                    <h3>Call us</h3>
                    <p>Mon-Fri from 8am to 5pm</p>
                    <a href="tel:+97165206327">(+971) 06 520 6327</a>
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

          {/* Map Section */}
          <div className="map-section">
            <div className="map-card">
              <h2 className="section-title">
                <span className="title-accent"></span>
                Our Location
              </h2>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.4193087832!2d55.4647!3d25.4052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f9e3e1e0e5e5%3A0x7f8f9e3e1e0e5e5!2sAl%20Karama%20Road%2C%20Ajman%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                  width="100%"
                  height="500"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mizan Mobile Shop Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContactUs;