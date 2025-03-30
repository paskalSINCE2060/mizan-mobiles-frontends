import React, { useState } from 'react';
import "./SellYourPhone.css"
import phone1 from '../../assets/iphone13pro.jpg'
import phone2 from '../../assets/iphone14.jpg'
import phone3 from '../../assets/iphone11promax.jpeg'

const SellYourPhone = () => {
  const [selectedPhone, setSelectedPhone] = useState(null);
  
  const phones = [
    {
      id: 1,
      name: "UltraPhone Pro",
      price: 999,
      image: phone1,
      colors: ["Black", "Silver", "Gold"],
      storage: ["128GB", "256GB", "512GB"],
      features: ["6.7\" AMOLED Display", "Triple Camera System", "All-day Battery", "Wireless Charging"]
    },
    {
      id: 2,
      name: "UltraPhone",
      price: 799,
      image: phone2,
      colors: ["Black", "Blue", "Red"],
      storage: ["128GB", "256GB"],
      features: ["6.1\" HD Display", "Dual Camera System", "Fast Charging"]
    },
    {
      id: 3,
      name: "UltraPhone Lite",
      price: 599,
      image: phone3,
      colors: ["Black", "White", "Green"],
      storage: ["64GB", "128GB"],
      features: ["5.8\" Display", "12MP Camera", "Long Battery Life"]
    }
  ];

  return (
    <div className="sale-your-phone container">
      <header className="sale-your-phone header">
        <h1 className="sale-your-phone title">Premium Smartphones</h1>
        <p className="sale-your-phone subtitle">Discover the perfect phone for your lifestyle</p>
      </header>

      {/* Featured Products */}
      <div className="sale-your-phone products-grid">
        {phones.map((phone) => (
          <div 
            key={phone.id} 
            className="sale-your-phone product-card"
            onClick={() => setSelectedPhone(phone)}
          >
            <div className="sale-your-phone product-image-container">
              <img 
                src={phone.image} 
                alt={phone.name} 
                className="sale-your-phone product-image"
              />
            </div>
            <div className="sale-your-phone product-details">
              <h2 className="sale-your-phone product-name">{phone.name}</h2>
              <p className="sale-your-phone product-price">${phone.price}</p>
              <div className="sale-your-phone color-options">
                <h3 className="sale-your-phone options-title">Available Colors:</h3>
                <div className="sale-your-phone colors-list">
                  {phone.colors.map(color => (
                    <span key={color} className="sale-your-phone color-tag">{color}</span>
                  ))}
                </div>
              </div>
              <ul className="sale-your-phone features-list">
                {phone.features.map((feature, index) => (
                  <li key={index} className="sale-your-phone feature-item">
                    <span className="sale-your-phone feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="sale-your-phone shop-button">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <section className="sale-your-phone benefits-section">
        <h2 className="sale-your-phone section-title">Why Choose Our Phones</h2>
        <div className="sale-your-phone benefits-grid">
          <div className="sale-your-phone benefit-card">
            <div className="sale-your-phone benefit-icon">⚡</div>
            <h3 className="sale-your-phone benefit-title">Lightning Fast</h3>
            <p className="sale-your-phone benefit-description">Experience incredible speed with our latest processors</p>
          </div>
          <div className="sale-your-phone benefit-card">
            <div className="sale-your-phone benefit-icon">📷</div>
            <h3 className="sale-your-phone benefit-title">Amazing Cameras</h3>
            <p className="sale-your-phone benefit-description">Capture life's moments with stunning clarity</p>
          </div>
          <div className="sale-your-phone benefit-card">
            <div className="sale-your-phone benefit-icon">🔋</div>
            <h3 className="sale-your-phone benefit-title">All-Day Battery</h3>
            <p className="sale-your-phone benefit-description">Stay connected longer with our powerful batteries</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="sale-your-phone cta-section">
        <h2 className="sale-your-phone cta-title">Ready to Upgrade?</h2>
        <p className="sale-your-phone cta-text">Check out our latest models and special offers</p>
        <button className="sale-your-phone cta-button">
          View All Phones
        </button>
      </section>
    </div>
  );
};

export default SellYourPhone;