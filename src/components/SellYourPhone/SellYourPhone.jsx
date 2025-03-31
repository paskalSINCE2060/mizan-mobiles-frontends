import React, { useState } from 'react';
import "./SellYourPhone.css"
import phone1 from '../../assets/iphone13pro.jpg'
import phone2 from '../../assets/iphone14.jpg'
import phone3 from '../../assets/iphone11promax.jpeg'

const SellYourPhone = () => {
  const [phoneDetails, setPhoneDetails] = useState({
    brand: '',
    model: '',
    condition: 'good',
    storage: '',
    hasCharger: false,
    contactEmail: '',
    contactPhone: '',
    description: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPhoneDetails({
      ...phoneDetails,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', phoneDetails);
    // Here you would typically send the data to your backend
    alert('Thank you for submitting your phone for sale!');
  };

  return (
    <>
        <div className="sale-me-your-phone-container">
      <div className="sale-me-your-phone-header">
        <h1>Sell Your Phone</h1>
        <p>Get the best price for your used phone today!</p>
      </div>

      <div className="sale-me-your-phone-content">
        <div className="sale-me-your-phone-info-section">
          <h2>How It Works</h2>
          <div className="sale-me-your-phone-steps">
            <div className="sale-me-your-phone-step">
              <div className="sale-me-your-phone-step-number">1</div>
              <div className="sale-me-your-phone-step-text">
                <h3>Fill Out The Form</h3>
                <p>Tell us about your phone and its condition</p>
              </div>
            </div>
            <div className="sale-me-your-phone-step">
              <div className="sale-me-your-phone-step-number">2</div>
              <div className="sale-me-your-phone-step-text">
                <h3>Get a Quote</h3>
                <p>We'll review your details and offer you a competitive price</p>
              </div>
            </div>
            <div className="sale-me-your-phone-step">
              <div className="sale-me-your-phone-step-number">3</div>
              <div className="sale-me-your-phone-step-text">
                <h3>Ship Your Phone</h3>
                <p>Send us your phone using our prepaid shipping label</p>
              </div>
            </div>
            <div className="sale-me-your-phone-step">
              <div className="sale-me-your-phone-step-number">4</div>
              <div className="sale-me-your-phone-step-text">
                <h3>Get Paid</h3>
                <p>Receive payment via PayPal, bank transfer, or store credit</p>
              </div>
            </div>
          </div>
        </div>

        <form className="sale-me-your-phone-form" onSubmit={handleSubmit}>
          <h2>Phone Details</h2>
          
          <div className="sale-me-your-phone-form-group">
            <label htmlFor="brand">Brand</label>
            <select 
              id="brand" 
              name="brand" 
              value={phoneDetails.brand} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Brand</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="google">Google</option>
              <option value="oneplus">OnePlus</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="model">Model</label>
            <input 
              type="text" 
              id="model" 
              name="model" 
              value={phoneDetails.model} 
              onChange={handleInputChange}
              placeholder="e.g. iPhone 13 Pro, Galaxy S21"
              required
            />
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="condition">Condition</label>
            <select 
              id="condition" 
              name="condition" 
              value={phoneDetails.condition} 
              onChange={handleInputChange}
              required
            >
              <option value="excellent">Excellent - Like New</option>
              <option value="good">Good - Minor Scratches</option>
              <option value="fair">Fair - Visible Wear</option>
              <option value="poor">Poor - Significant Damage</option>
            </select>
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="storage">Storage Capacity</label>
            <select 
              id="storage" 
              name="storage" 
              value={phoneDetails.storage} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Storage</option>
              <option value="16">16GB</option>
              <option value="32">32GB</option>
              <option value="64">64GB</option>
              <option value="128">128GB</option>
              <option value="256">256GB</option>
              <option value="512">512GB</option>
              <option value="1024">1TB</option>
            </select>
          </div>

          <div className="sale-me-your-phone-form-group">
            <label className="sale-me-your-phone-checkbox-label">
              <input 
                type="checkbox" 
                name="hasCharger" 
                checked={phoneDetails.hasCharger} 
                onChange={handleInputChange}
              />
              Includes original charger
            </label>
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="phoneImage">Upload Phone Image</label>
            <input 
              type="file" 
              id="phoneImage" 
              name="phoneImage" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            {previewImage && (
              <div className="sale-me-your-phone-image-preview">
                <img src={previewImage} alt="Phone preview" />
              </div>
            )}
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="description">Additional Details</label>
            <textarea 
              id="description" 
              name="description" 
              value={phoneDetails.description} 
              onChange={handleInputChange}
              placeholder="Tell us more about your phone's condition, included accessories, etc."
              rows="4"
            />
          </div>

          <h2>Contact Information</h2>
          
          <div className="sale-me-your-phone-form-group">
            <label htmlFor="contactEmail">Email</label>
            <input 
              type="email" 
              id="contactEmail" 
              name="contactEmail" 
              value={phoneDetails.contactEmail} 
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="sale-me-your-phone-form-group">
            <label htmlFor="contactPhone">Phone Number</label>
            <input 
              type="tel" 
              id="contactPhone" 
              name="contactPhone" 
              value={phoneDetails.contactPhone} 
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="sale-me-your-phone-submit-btn">
            Get Quote
          </button>
        </form>
      </div>

      <div className="sale-me-your-phone-testimonials">
        <h2>What Our Customers Say</h2>
        <div className="sale-me-your-phone-testimonial-container">
          <div className="sale-me-your-phone-testimonial">
            <p>"The process was quick and easy. I got a fair price for my old iPhone and the money was in my account within 48 hours!"</p>
            <span className="sale-me-your-phone-testimonial-author">- Sarah T.</span>
          </div>
          <div className="sale-me-your-phone-testimonial">
            <p>"I was skeptical at first, but the quote they gave me was higher than other sites. Very satisfied with the service!"</p>
            <span className="sale-me-your-phone-testimonial-author">- Mike R.</span>
          </div>
          <div className="sale-me-your-phone-testimonial">
            <p>"The shipping label made it so convenient. I just packed up my phone and dropped it off. Got paid exactly what they quoted!"</p>
            <span className="sale-me-your-phone-testimonial-author">- Jessica L.</span>
          </div>
        </div>
      </div>
      </div>




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
        <a href="/categories">
        <button className="sale-your-phone cta-button">
          View All Phones
        </button> 
        </a>
       
      </section>
    </div>

    </>
  );
};

export default SellYourPhone;