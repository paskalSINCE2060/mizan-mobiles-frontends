import React, { useState, useEffect } from 'react';
import { addToCart } from '../../slice/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './SpecialOffers.css';

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Offers');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/special-offers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedOffers = data.offers || [];  // <-- FIX: get offers array from response

      // Filter only active offers and those that haven't expired
      const currentDate = new Date();
      const activeOffers = fetchedOffers.filter(offer => {
        const isActive = offer.isActive;
        const isValid = new Date(offer.validUntil) >= currentDate;
        return isActive && isValid;
      });

      // Transform the API data to match your existing frontend structure
      const transformedOffers = activeOffers.map(offer => ({
        id: offer._id,
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        validUntil: offer.validUntil,
        image: offer.image || getDefaultImage(offer.category), // Use API image or fallback
        category: offer.category,
        promoCode: offer.promoCode,
        redemptionSteps: offer.redemptionSteps || [
          "Add eligible items to your cart",
          "Enter promo code during checkout",
          "Discount will be applied automatically"
        ],
        // Transform product details for cart functionality
        productDetails: {
          name: offer.productDetails?.name || getDefaultProductName(offer.category),
          price: offer.productDetails?.originalPrice || offer.productDetails?.price || 100000,
          discountedPrice: offer.productDetails?.discountedPrice || calculateDiscountedPrice(
            offer.productDetails?.originalPrice || offer.productDetails?.price || 100000,
            offer.discountType,
            offer.discountValue
          ),
          originalPrice: offer.productDetails?.originalPrice || offer.productDetails?.price || 100000,
          discountPercentage: offer.discountType === 'percentage' ? offer.discountValue : 0,
          description: offer.productDetails?.description || offer.description,
          specs: parseSpecs(offer.productDetails?.specs),
          // Special offer flags
          bundleDiscount: offer.discountType === 'bundle' ? offer.discountValue : 0,
          freeGift: offer.discountType === 'gift' ? offer.productDetails?.giftItem || "Free Gift" : null,
          tradeInBonus: offer.category === 'Trade-in' || offer.title.toLowerCase().includes('trade'),
          requiresVerification: offer.category === 'Student' || offer.title.toLowerCase().includes('student')
        }
      }));

      setOffers(transformedOffers);
      setFilteredOffers(transformedOffers);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to fetch offers. Please try again later.');
      setOffers([]);
      setFilteredOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountType, discountValue) => {
    if (!originalPrice || !discountValue) return originalPrice;

    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed') {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  };

  // Helper function to get default product name based on category
  const getDefaultProductName = (category) => {
    const categoryProducts = {
      'Apple': 'iPhone 15 Pro',
      'Samsung': 'Samsung Galaxy S24',
      'Google': 'Google Pixel 8 Pro',
      'OnePlus': 'OnePlus 12',
      'Xiaomi': 'Xiaomi 14',
      'Accessories': 'Premium Phone Case',
      'Trade-in': 'Trade-in Any Phone',
      'Student': 'Any Phone - Student Discount'
    };
    return categoryProducts[category] || 'Smartphone';
  };

  // Helper function to get default image based on category
  const getDefaultImage = (category) => {
    return '/images/default-offer.jpg'; // Replace with your default image path
  };

  // Helper function to parse specs string into object
  const parseSpecs = (specsString) => {
    if (!specsString) return {};

    try {
      if (typeof specsString === 'object') return specsString;
      if (specsString.startsWith('{')) {
        return JSON.parse(specsString);
      }
      return {
        description: specsString
      };
    } catch {
      return { description: specsString };
    }
  };

  useEffect(() => {
    if (activeFilter === 'All Offers') {
      setFilteredOffers(offers);
    } else {
      const filtered = offers.filter(offer => offer.category === activeFilter);
      setFilteredOffers(filtered);
    }
  }, [activeFilter, offers]);

  const getAvailableCategories = () => {
    const categories = ['All Offers'];
    const uniqueCategories = [...new Set(offers.map(offer => offer.category))];
    return categories.concat(uniqueCategories);
  };

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

  const handleAddToCart = () => {
    if (selectedOffer && selectedOffer.productDetails) {
      const { productDetails } = selectedOffer;

      const discountedPrice = productDetails.discountPercentage
        ? productDetails.price * (1 - productDetails.discountPercentage / 100)
        : productDetails.discountedPrice || productDetails.price;

      const cartItem = {
        id: `${selectedOffer.id}-${Date.now()}`,
        name: productDetails.name,
        price: discountedPrice,
        originalPrice: productDetails.originalPrice || productDetails.price,
        quantity: 1,
        image: selectedOffer.image,
        promoCode: selectedOffer.promoCode,
        discountApplied: productDetails.discountPercentage > 0,
        discountPercentage: productDetails.discountPercentage || 0,
        specialOffer: {
          title: selectedOffer.title,
          description: selectedOffer.description
        }
      };

      dispatch(addToCart(cartItem));

      toast.success("Added to Cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setShowModal(false);
      setSelectedOffer(null);

      setTimeout(() => {
        navigate('/cart');
      }, 2000);
    }
  };

  const copyPromoCode = () => {
    if (selectedOffer && selectedOffer.promoCode) {
      navigator.clipboard.writeText(selectedOffer.promoCode)
        .then(() => {
          toast.success('Promo code copied to clipboard!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast.error('Failed to copy promo code', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        });
    }
  };

  const handleImageClick = (offer) => {
    if (offer && offer.productDetails) {
      navigate('/productdetails', {
        state: {
          product: {
            ...offer.productDetails,
            image: offer.image,
            specialOffer: {
              title: offer.title,
              description: offer.description,
              discount: offer.discount,
              validUntil: offer.validUntil,
              promoCode: offer.promoCode
            }
          }
        }
      });
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
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
        <button onClick={fetchOffers}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="offers-page-container">
      <ToastContainer />
      <div className="offers-header">
        <h1>Special Offers</h1>
        <p>Exclusive deals on mobile phones and accessories</p>
      </div>

      <div className="offers-filter-container">
        {getAvailableCategories().map(category => (
          <button
            key={category}
            className={`offers-filter-button ${activeFilter === category ? 'active' : ''}`}
            onClick={() => handleFilterClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="offers-grid">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div
                className="offer-card-image"
                onClick={() => handleImageClick(offer)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  onError={(e) => {
                    e.target.src = '/images/default-offer.jpg';
                  }}
                />
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
          ))
        ) : (
          <div className="no-offers-message">
            <p>No offers available for {activeFilter} at this time.</p>
            <button onClick={fetchOffers} className="refresh-button">
              Refresh Offers
            </button>
          </div>
        )}
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
              <button className="add-to-cart-button" onClick={handleAddToCart}>
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
