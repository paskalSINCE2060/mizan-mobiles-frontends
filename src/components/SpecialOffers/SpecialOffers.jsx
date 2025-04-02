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
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // This would typically be an API call to fetch offers
    // For demonstration, using mock data
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockOffers = [
          {
            id: 1,
            title: "Flash Sale: 20% Off All iPhones",
            description: "Limited time offer on all iPhone models. Get yours now!",
            discount: "20%",
            validUntil: "2025-04-15",
            image: sellPhone,
            category: "Apple",
            promoCode: "IPHONE20",
            redemptionSteps: [
              "Add any iPhone to your cart",
              "Enter promo code during checkout",
              "Discount will be applied automatically"
            ]
          },
          {
            id: 2,
            title: "Buy One Get One 50% Off",
            description: "Purchase any Samsung Galaxy and get 50% off on accessories",
            discount: "50%",
            validUntil: "2025-04-30",
            image: GalaxyWatch7,
            category: "Samsung",
            promoCode: "SAMSUNG50",
            redemptionSteps: [
              "Add Samsung Galaxy phone to your cart",
              "Add any accessories you want",
              "Enter promo code at checkout",
              "50% will be deducted from accessories"
            ]
          },
          {
            id: 3,
            title: "Special Bundle: Phone + Earbuds",
            description: "Get free wireless earbuds with any Google Pixel purchase",
            discount: "Free Gift",
            validUntil: "2025-05-10",
            image: GalaxyBuds3,
            category: "Google",
            promoCode: "PIXELBUDS",
            redemptionSteps: [
              "Add any Google Pixel phone to your cart",
              "Add compatible earbuds to your cart",
              "Enter promo code at checkout",
              "Earbuds price will be deducted automatically"
            ]
          },
          {
            id: 4,
            title: "Trade-in Special",
            description: "Extra $100 value when you trade in your old phone",
            discount: "$100",
            validUntil: "2025-04-20",
            image: repair,
            category: "All Brands",
            promoCode: "TRADEIN100",
            redemptionSteps: [
              "Select 'Trade-in' option during purchase",
              "Enter the details of your current phone",
              "Use promo code when prompted",
              "$100 will be added to the standard trade-in value"
            ]
          },
          {
            id: 5,
            title: "Weekend Flash Deal",
            description: "30% off all phone cases and screen protectors",
            discount: "30%",
            validUntil: "2025-04-10",
            image: repair4,
            category: "Accessories",
            promoCode: "PROTECT30",
            redemptionSteps: [
              "Add any phone case or screen protector to cart",
              "Enter promo code at checkout",
              "Discount applies to all eligible accessories"
            ]
          },
          {
            id: 6,
            title: "Student Discount",
            description: "Extra 15% off with valid student ID on any phone",
            discount: "15%",
            validUntil: "2025-05-31",
            image: RepairPhone,
            category: "All Brands",
            promoCode: "STUDENT15",
            redemptionSteps: [
              "Add any phone to your cart",
              "Upload a copy of your student ID during checkout",
              "Enter promo code when prompted",
              "Discount will be applied after verification"
            ]
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

  const handleClaimOffer = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOffer(null);
  };

  const addToCart = () => {
    // This would connect to your cart functionality
    alert(`Offer "${selectedOffer.title}" has been applied. Redirecting to cart...`);
    closeModal();
    // Redirect logic would go here
  };

  const copyPromoCode = () => {
    if (selectedOffer && selectedOffer.promoCode) {
      navigator.clipboard.writeText(selectedOffer.promoCode)
        .then(() => {
          alert('Promo code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
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
              <button 
                className="offer-cta-button"
                onClick={() => handleClaimOffer(offer)}
              >
                Claim Offer
              </button>
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

      {/* Claim Offer Modal */}
      {showModal && selectedOffer && (
        <div className="offer-modal-overlay" onClick={closeModal}>
          <div className="offer-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>×</button>
            
            <div className="offer-modal-header">
              <h2>{selectedOffer.title}</h2>
              <div className="offer-modal-discount">{selectedOffer.discount} OFF</div>
            </div>
            
            <div className="offer-modal-details">
              <p>{selectedOffer.description}</p>
              <p><strong>Valid until:</strong> {formatDate(selectedOffer.validUntil)}</p>
              
              <div className="offer-promo-code-container">
                <h3>Your Promo Code:</h3>
                <div className="offer-promo-code">
                  <span>{selectedOffer.promoCode}</span>
                  <button onClick={copyPromoCode} className="copy-code-button">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="offer-steps-container">
                <h3>How to Redeem:</h3>
                <ol className="offer-redemption-steps">
                  {selectedOffer.redemptionSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="offer-modal-actions">
              <button className="add-to-cart-button" onClick={addToCart}>
                Add to Cart with Offer
              </button>
              <button className="continue-shopping-button" onClick={closeModal}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;