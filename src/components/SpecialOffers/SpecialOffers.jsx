import React, { useState, useEffect } from 'react';
import sellPhone from '../../assets/sellPhone.webp';
import GalaxyWatch7 from '../../assets/GalaxyWatch7.jpeg';
import GalaxyBuds3 from '../../assets/GalaxyBuds3.jpeg';
import repair from '../../assets/repair.jpeg';
import repair4 from '../../assets/repair4.jpeg';
import RepairPhone from '../../assets/RepairPhone.webp';
import './SpecialOffers.css';

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockOffers = [
          {
            id: 1,
            title: "Flash Sale: 20% Off All iPhones",
            description: "Limited time offer on all iPhone models. Get yours now!",
            discount: "20%",
            validUntil: "2025-04-15",
            image: sellPhone,
            category: "Apple"
          },
          {
            id: 2,
            title: "Buy One Get One 50% Off",
            description: "Purchase any Samsung Galaxy and get 50% off on accessories",
            discount: "50%",
            validUntil: "2025-04-30",
            image: GalaxyWatch7,
            category: "Samsung"
          },
          {
            id: 3,
            title: "Special Bundle: Phone + Earbuds",
            description: "Get free wireless earbuds with any Google Pixel purchase",
            discount: "Free Gift",
            validUntil: "2025-05-10",
            image: GalaxyBuds3,
            category: "Google"
          },
          {
            id: 4,
            title: "Trade-in Special",
            description: "Extra $100 value when you trade in your old phone",
            discount: "$100",
            validUntil: "2025-04-20",
            image: RepairPhone,
            category: "All Brands"
          },
          {
            id: 5,
            title: "Weekend Flash Deal",
            description: "30% off all phone cases and screen protectors",
            discount: "30%",
            validUntil: "2025-04-10",
            image: repair,
            category: "Accessories"
          },
          {
            id: 6,
            title: "Student Discount",
            description: "Extra 15% off with valid student ID on any phone",
            discount: "15%",
            validUntil: "2025-05-31",
            image:repair4,
            category: "All Brands"
          }
        ];
        
        setOffers(mockOffers);
      } catch (err) {
        setError('Failed to fetch offers. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="offers-loading-container">
        <div className="offers-loading-spinner"></div>
        <p>Loading special offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-error-container">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="offers-page-container">
      <div className="offers-header">
        <h1>Special Offers</h1>
        <p>Exclusive deals on mobile phones and accessories</p>
      </div>

      <div className="offers-filter-container">
        <button className="offers-filter-button active">All Offers</button>
        <button className="offers-filter-button">Apple</button>
        <button className="offers-filter-button">Samsung</button>
        <button className="offers-filter-button">Google</button>
        <button className="offers-filter-button">Accessories</button>
      </div>

      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-card-image">
              <img src={offer.image} alt={offer.title} />
              <div className="offer-discount-badge">{offer.discount}</div>
            </div>
            <div className="offer-card-content">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p className="offer-expiry">Valid until: {formatDate(offer.validUntil)}</p>
              <button className="offer-cta-button">Claim Offer</button>
            </div>
          </div>
        ))}
      </div>

      <div className="offers-newsletter">
        <div className="offers-newsletter-content">
          <h2>Get Exclusive Offers</h2>
          <p>Subscribe to our newsletter and be the first to know about our special deals!</p>
          <div className="offers-newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;