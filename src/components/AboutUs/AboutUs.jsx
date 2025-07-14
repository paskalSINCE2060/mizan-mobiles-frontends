import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="aboutUs-container">
      
      {/* Header Section */}
      <div className="header-section">
        <h1 className="main-titles">About Mizan</h1>
        <p className="main-subtitle">
          Your trusted partner in technology solutions, bringing you the latest gadgets 
          and exceptional service since 2019.
        </p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-section">
        
        {/* About Us */}
        <div className="content-card">
          <h2 className="card-title">
            <div className="card-icon">🏢</div>
            Who We Are
          </h2>
          <p className="card-description">
            Mizan is a leading technology retailer specializing in mobile phones, laptops, 
            accessories, and cutting-edge gadgets. We are passionate about bringing the latest 
            innovations to our customers while providing exceptional service and competitive prices. 
            Our commitment to quality and customer satisfaction has made us a trusted name in the tech industry.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="two-column">
          <div className="content-card">
            <h2 className="card-title">
              <div className="card-icon">🚀</div>
              Our Vision
            </h2>
            <p className="card-description">
              To be the premier destination for technology enthusiasts, making cutting-edge 
              innovations accessible to everyone and empowering our customers to embrace 
              the digital future with confidence.
            </p>
          </div>

          <div className="content-card">
            <h2 className="card-title">
              <div className="card-icon">🎯</div>
              Our Mission
            </h2>
            <p className="card-description">
              Providing high-quality, affordable technology solutions with exceptional 
              customer service, building lasting relationships, and staying at the 
              forefront of technological advancement.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="content-card">
          <h2 className="card-title">
            <div className="card-icon">⭐</div>
            Our Core Values
          </h2>
          <div className="values-grid">
            <div className="value-item">
              <span className="value-title">Quality Assurance</span>
              <span className="value-description">
                We carefully curate our products to ensure only the highest quality items reach our customers.
              </span>
            </div>
            <div className="value-item">
              <span className="value-title">Innovation Focus</span>
              <span className="value-description">
                Staying ahead of technology trends to bring you tomorrow's innovations today.
              </span>
            </div>
            <div className="value-item">
              <span className="value-title">Customer First</span>
              <span className="value-description">
                Your satisfaction is our priority. We go above and beyond to exceed your expectations.
              </span>
            </div>
            <div className="value-item">
              <span className="value-title">Integrity & Trust</span>
              <span className="value-description">
                Building relationships based on honesty, transparency, and reliable service.
              </span>
            </div>
            <div className="value-item">
              <span className="value-title">Continuous Improvement</span>
              <span className="value-description">
                Always evolving our services and processes to serve you better.
              </span>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="content-card">
          <h2 className="card-title">
            <div className="card-icon">👥</div>
            Our Team
          </h2>
          <p className="card-description">
            Our dedicated team of technology experts and customer service professionals work 
            together to provide you with the best possible experience. From product specialists 
            to technical support, we're here to help you find the perfect technology solution.
          </p>
          <div className="team-members">
            <div className="team-member">
              <div className="member-name">Product Specialists</div>
              <div className="member-role">Expert product knowledge and recommendations</div>
            </div>
            <div className="team-member">
              <div className="member-name">Technical Support</div>
              <div className="member-role">24/7 assistance and troubleshooting</div>
            </div>
            <div className="team-member">
              <div className="member-name">Customer Service</div>
              <div className="member-role">Friendly support for all your needs</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="content-card contact-section">
          <h2 className="card-title">
            <div className="card-icon">📞</div>
            Get in Touch
          </h2>
          <p className="card-description">
            Ready to explore the latest in technology? Have questions about our products or services? 
            Our friendly team is here to help you every step of the way.
          </p>
          <a href="mailto:support@mizanmobile.com" className="contact-link">
            Contact Us Today
          </a>
          <p className="card-description" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            Follow us on social media for the latest updates, exclusive deals, and tech tips!
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;