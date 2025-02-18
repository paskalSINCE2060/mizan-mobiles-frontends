import React from 'react';
import mizan from '../../assets/mizan-banner.png';
import team from '../../assets/team.png'
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="aboutUs-container">
      <div className="aboutUs-content">
        <img src={mizan} alt="TechStore Team" className="aboutUs-image" />
        <p>
          Welcome to <span className="highlight">TechStore</span>, your ultimate destination for the latest tech gadgets.
          We bring you top-notch mobile phones, laptops, accessories, and more, ensuring quality and innovation at every step.
        </p>
      </div>
      <div className="aboutUs-vision">
        <h2>Our Vision</h2>
        <p>
          We believe in a world where technology simplifies life. Our goal is to make cutting-edge innovations accessible
          to everyone.
        </p>
      </div>
      <div className="aboutUs-mission">
        <h2>Our Mission</h2>
        <p>
          Providing high-quality, affordable, and reliable technology solutions to individuals and businesses alike.
        </p>
      </div>
      <div className="aboutUs-values">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Quality:</strong> Only the best for our customers.</li>
          <li><strong>Innovation:</strong> Staying ahead of tech trends.</li>
          <li><strong>Customer Satisfaction:</strong> Your happiness is our success.</li>
          <li><strong>Integrity:</strong> We value honesty and transparency.</li>
        </ul>
      </div>
      <div className="aboutUs-team">
        <h2>Meet Our Team</h2>
        <img src={team} alt="Our Team" className="aboutUs-image" />
        <p>
          A passionate team of tech enthusiasts dedicated to bringing you the best products and services.
        </p>
      </div>
      <div className="aboutUs-contact">
        <h2>Contact Us</h2>
        <p>
          Need assistance? Reach out at <a href="mailto:support@techstore.com">support@techstore.com</a> or follow us on social media for updates and exclusive deals!
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
