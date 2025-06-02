import React, { useState, useEffect } from 'react';
import { addToCart } from '../../slice/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sellPhone from '../../assets/sellPhone.webp';
import GalaxyWatch7 from '../../assets/GalaxyWatch7.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import GalaxyBuds3 from '../../assets/GalaxyBuds3.jpeg';
import repair from '../../assets/repair.jpeg';
import repair4 from '../../assets/repair4.jpeg';
import RepairPhone from '../../assets/RepairPhone.webp';
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
            ],
            // Added product details for cart
            productDetails: {
              name: "iPhone 15 Pro",
              price: 150000,
              discountedPrice: 120000,
              originalPrice: 150000,
              discountPercentage: 20,
              description: "The iPhone 15 Pro features a powerful A17 Pro chip, titanium design, and an advanced camera system with a 48MP main camera.",
              specs: {
                storage: "256GB",
                display: "6.1-inch Super Retina XDR display",
                camera: "48MP main, 12MP ultra wide, 12MP telephoto",
                chip: "A17 Pro chip"
              }
            }
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
            ],
            // Added product details for cart
            productDetails: {
              name: "Samsung Galaxy S24",
              price: 120000,
              discountedPrice: 120000,
              originalPrice: 120000,
              discountPercentage: 0,
              bundleDiscount: 50,
              description: "The Samsung Galaxy S24 features a stunning AMOLED display, powerful processor, and advanced camera system with AI enhancements.",
              specs: {
                storage: "256GB",
                display: "6.2-inch Dynamic AMOLED 2X display",
                camera: "50MP main, 12MP ultra wide, 10MP telephoto",
                chip: "Snapdragon 8 Gen 3"
              }
            }
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
            ],
            // Added product details for cart
            productDetails: {
              name: "Google Pixel 8 Pro",
              price: 130000,
              discountedPrice: 130000,
              originalPrice: 130000,
              discountPercentage: 0,
              freeGift: "Google Pixel Buds",
              description: "The Google Pixel 8 Pro features an outstanding camera system with advanced AI capabilities, a vibrant display, and pure Android experience.",
              specs: {
                storage: "256GB",
                display: "6.7-inch LTPO OLED display",
                camera: "50MP main, 48MP ultra wide, 48MP telephoto",
                chip: "Google Tensor G3"
              }
            }
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
            ],
            // Added product details for cart
            productDetails: {
              name: "Trade-in Any Phone",
              price: -10000, // NPR equivalent of $100 discount
              discountedPrice: -10000,
              originalPrice: 0,
              discountPercentage: 0,
              tradeInBonus: true,
              description: "Trade in your old phone and receive an extra NPR 10,000 on top of the standard trade-in value.",
              specs: {
                eligibility: "Any smartphone in working condition",
                bonus: "Extra NPR 10,000 in trade-in value",
                process: "In-store or online evaluation"
              }
            }
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
            ],
            // Added product details for cart
            productDetails: {
              name: "Premium Phone Case",
              price: 5000,
              discountedPrice: 3500,
              originalPrice: 5000,
              discountPercentage: 30,
              description: "High-quality protective cases for all phone models. Premium materials with shock absorption technology.",
              specs: {
                material: "Premium silicone and polycarbonate",
                protection: "Military-grade drop protection",
                compatibility: "All major phone models",
                features: "Raised edges for screen protection"
              }
            }
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
            ],
            // Added product details for cart
            productDetails: {
              name: "Any Phone - Student Discount",
              price: 100000,
              discountedPrice: 85000,
              originalPrice: 100000,
              discountPercentage: 15,
              requiresVerification: true,
              description: "Special student discount applicable on any smartphone purchase with valid student ID verification.",
              specs: {
                eligibility: "Valid student ID required",
                discount: "15% off on any smartphone",
                process: "ID verification during checkout"
              }
            }
          }
        ];
        
        setOffers(mockOffers);
        setFilteredOffers(mockOffers); // Initially show all offers
      } catch (err) {
        setError('Failed to fetch offers. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Filter offers when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All Offers') {
      setFilteredOffers(offers);
    } else {
      const filtered = offers.filter(offer => offer.category === activeFilter);
      setFilteredOffers(filtered);
    }
  }, [activeFilter, offers]);

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
      
      // Calculate the discounted price if there's a discount percentage
      const discountedPrice = productDetails.discountPercentage 
        ? productDetails.price * (1 - productDetails.discountPercentage / 100) 
        : productDetails.discountedPrice || productDetails.price;
      
      // Prepare cart item with discount info
      const cartItem = {
        id: `${selectedOffer.id}-${Date.now()}`, // Unique ID
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
      
      // Dispatch the addToCart action using Redux
      dispatch(addToCart(cartItem));
      
      // Show success toast
      toast.success("Added to Cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
      // Close modal
      setShowModal(false);
      setSelectedOffer(null);
      
      // Optional: Navigate to cart page after adding item
      setTimeout(() => {
        navigate('/cart');
      }, 2000); // Wait for toast to show, then navigate
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

  // Handle image click to navigate to product details page
  const handleImageClick = (offer) => {
    if (offer && offer.productDetails) {
      // Navigate to product details page with the offer data
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

  // Handle filter button click
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
        <button onClick={() => window.location.reload()}>Try Again</button>
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
        <button 
          className={`offers-filter-button ${activeFilter === 'All Offers' ? 'active' : ''}`}
          onClick={() => handleFilterClick('All Offers')}
        >
          All Offers
        </button>
        <button 
          className={`offers-filter-button ${activeFilter === 'Apple' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Apple')}
        >
          Apple
        </button>
        <button 
          className={`offers-filter-button ${activeFilter === 'Samsung' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Samsung')}
        >
          Samsung
        </button>
        <button 
          className={`offers-filter-button ${activeFilter === 'Google' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Google')}
        >
          Google
        </button>
        <button 
          className={`offers-filter-button ${activeFilter === 'Accessories' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Accessories')}
        >
          Accessories
        </button>
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
          ))
        ) : (
          <div className="no-offers-message">
            <p>No offers available for {activeFilter} at this time.</p>
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