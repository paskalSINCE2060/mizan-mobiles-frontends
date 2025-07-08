import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartTax
} from '../../slice/cartSlice';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RZ4zGQ9OmwB8bpp35ErMBnuz09VsSSXsJJdmCUvLUR8MCLOijUNHvcZqCjFwJi5FfMkrQmDjyUNFFCtaHkTtiU5004WSypiWD');

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 3000);
    }
  }, [navigate]);

  const Toast = ({ message, show }) => {
    if (!show) return null;
    return (
      <div className="toast-notification">
        <div className="toast-content">
          <span>{message}</span>
        </div>
      </div>
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Process images URLs before sending to backend
      const processedCartItems = cartItems.map(item => ({
        ...item,
        image: item.image.startsWith('http')
          ? item.image
          : `https://mizan.com.np${item.image}`
      }));

      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: processedCartItems })
      });

      const data = await response.json();

      if (data.id) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) {
          alert(error.message);
          setLoading(false);
        }
      } else {
        alert("Failed to initiate payment session.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!storedUser) {
    return (
      <div className="Checkout-page">
        <Toast message="Please login to checkout!" show={showToast} />
        <div className="Checkout-page-container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Redirecting to login...</h2>
          <p>You need to be logged in to access the checkout page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Checkout-page">
      <Toast message="Please login to checkout!" show={showToast} />

      <header className="Checkout-page-header">
        <div className="Checkout-page-container">
          <h1>Checkout</h1>
        </div>
      </header>

      <div className="Checkout-page-container" id="checkout-container">
        <div className="Checkout-page-checkout-content">
          {/* Order Summary */}
          <div className="Checkout-page-summary">
            <div className="Checkout-page-summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="Checkout-page-summary-products">
              {cartItems.map(item => {
                const key = `${item.id}-${item.specialOffer?.id || 'nooffer'}`;
                return (
                  <div key={key} className="Checkout-page-summary-product">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>NPR {(item.price * item.quantity).toLocaleString()}</p>
                      {item.specialOffer && (
                        <p className="special-offer-text">
                          <small>{item.specialOffer.title}</small>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="Checkout-page-summary-totals">
              <div className="Checkout-page-summary-row">
                <span>Subtotal:</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="Checkout-page-summary-row">
                <span>Shipping:</span>
                <span>NPR {shipping.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="Checkout-page-summary-row">
                <span>Tax (8%):</span>
                <span>NPR {tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="Checkout-page-summary-row total">
                <span>Total:</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Show active promotions if any */}
            {cartItems.some(item => item.discountApplied) && (
              <div className="Checkout-page-active-promotions">
                <h4>Active Promotions</h4>
                {cartItems
                  .filter(item => item.discountApplied)
                  .map(item => {
                    const key = `promo-${item.id}-${item.specialOffer?.id || 'nooffer'}`;
                    return (
                      <div key={key} className="Checkout-page-promotion-item">
                        <span>{item.specialOffer?.title || `${item.discountPercentage}% Off`}</span>
                        <span className="savings">
                          -NPR {((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                <div className="total-savings">
                  <strong>
                    Total Savings: NPR {cartItems
                      .filter(item => item.discountApplied)
                      .reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0)
                      .toLocaleString()}
                  </strong>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="checkout-actions" style={{ marginTop: '20px' }}>
              <button 
                onClick={handleCheckout} 
                disabled={loading || cartItems.length === 0}
                className="Checkout-page-btn Checkout-page-btn-submit"
                style={{ width: '100%' }}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#666' }}>
                You'll be redirected to Stripe to complete your payment securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
