import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext';
import './Checkout.css';
import { CreditCard, Truck, User, ChevronRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RZ4zGQ9OmwB8bpp35ErMBnuz09VsSSXsJJdmCUvLUR8MCLOijUNHvcZqCjFwJi5FfMkrQmDjyUNFFCtaHkTtiU5004WSypiWD'); // Replace with your Stripe publishable key

const Checkout = () => {
  const { cartItems, calculateSubtotal } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const shippingCharge = 15.00;
  const taxRate = 0.08; // 8% tax rate

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToStep = (step) => {
    if (validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return formData.name.trim() !== '' && formData.email.trim() !== '';
    } else if (currentStep === 2) {
      return formData.address.trim() !== '' && formData.city.trim() !== '' && formData.zipCode.trim() !== '';
    }
    return true;
  };

  const validateForm = () => {
    return formData.cardNumber.trim() !== '' && 
           formData.cardExpiry.trim() !== '' && 
           formData.cardCvv.trim() !== '' &&
           cartItems.length > 0;
  };

  // New handleSubmit with Stripe checkout session
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all payment fields and have items in cart.");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Call your backend to create Stripe checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      });

      const data = await response.json();

      if (data.id) {
        // Redirect to Stripe Checkout
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

  const getProgressWidth = () => {
    if (currentStep === 2) return '50%';
    if (currentStep === 3) return '100%';
    return '0%';
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + shippingCharge + (subtotal * taxRate);
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
        <div className="Checkout-page-checkout-steps">
          <div className={`Checkout-page-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} data-step="1">
            <div className="Checkout-page-step-number">1</div>
            <div className="Checkout-page-step-title">Information</div>
          </div>

          <div className={`Checkout-page-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} data-step="2">
            <div className="Checkout-page-step-number">2</div>
            <div className="Checkout-page-step-title">Shipping</div>
          </div>

          <div className={`Checkout-page-step ${currentStep === 3 ? 'active' : ''}`} data-step="3">
            <div className="Checkout-page-step-number">3</div>
            <div className="Checkout-page-step-title">Payment</div>
          </div>

          <div className="Checkout-page-step-line">
            <div className="Checkout-page-step-line-progress" style={{ width: getProgressWidth() }}></div>
          </div>
        </div>

        <div className="Checkout-page-checkout-content">
          <div className="Checkout-page-checkout-form">
            <form id="checkout-form" onSubmit={handleSubmit}>
              {/* Contact Information Step */}
              <div className={`Checkout-page-step-content ${currentStep === 1 ? 'active' : ''}`} data-step="1">
                <div className="Checkout-page-step-header">
                  <div className="Checkout-page-step-icon"><User /></div>
                  <h2 className="Checkout-page-step-heading">Contact Information</h2>
                </div>

                <div className="Checkout-page-form-group">
                  <label htmlFor="name" className="Checkout-page-form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="Checkout-page-form-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="Checkout-page-form-group">
                  <label htmlFor="email" className="Checkout-page-form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="Checkout-page-form-input" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="Checkout-page-form-buttons">
                  <div></div>
                  <button type="button" className="Checkout-page-btn Checkout-page-btn-next" onClick={() => goToStep(2)}>
                    Continue
                    <ChevronRight />
                  </button>
                </div>
              </div>

              {/* Shipping Information Step */}
              <div className={`Checkout-page-step-content ${currentStep === 2 ? 'active' : ''}`} data-step="2">
                <div className="Checkout-page-step-header">
                  <div className="Checkout-page-step-icon"><Truck /></div>
                  <h2 className="Checkout-page-step-heading">Shipping Information</h2>
                </div>

                <div className="Checkout-page-form-group">
                  <label htmlFor="address" className="Checkout-page-form-label">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    className="Checkout-page-form-input" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="Checkout-page-input-group">
                  <div className="Checkout-page-form-group">
                    <label htmlFor="city" className="Checkout-page-form-label">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      className="Checkout-page-form-input" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="Checkout-page-form-group">
                    <label htmlFor="zipCode" className="Checkout-page-form-label">Zip Code</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      name="zipCode" 
                      className="Checkout-page-form-input" 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="Checkout-page-form-buttons">
                  <button type="button" className="Checkout-page-btn Checkout-page-btn-prev" onClick={() => goToStep(1)}>
                    Back
                  </button>
                  <button type="button" className="Checkout-page-btn Checkout-page-btn-next" onClick={() => goToStep(3)}>
                    Continue
                    <ChevronRight />
                  </button>
                </div>
              </div>

              {/* Payment Step */}
              <div className={`Checkout-page-step-content ${currentStep === 3 ? 'active' : ''}`} data-step="3">
                <div className="Checkout-page-step-header">
                  <div className="Checkout-page-step-icon"><CreditCard /></div>
                  <h2 className="Checkout-page-step-heading">Payment</h2>
                </div>

                <div className="Checkout-page-form-group">
                  <label htmlFor="cardNumber" className="Checkout-page-form-label">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="Checkout-page-form-input"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="Checkout-page-input-group">
                  <div className="Checkout-page-form-group">
                    <label htmlFor="cardExpiry" className="Checkout-page-form-label">Expiry Date</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      className="Checkout-page-form-input"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="Checkout-page-form-group">
                    <label htmlFor="cardCvv" className="Checkout-page-form-label">CVV</label>
                    <input
                      type="text"
                      id="cardCvv"
                      name="cardCvv"
                      className="Checkout-page-form-input"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="Checkout-page-form-buttons">
                  <button type="button" className="Checkout-page-btn Checkout-page-btn-prev" onClick={() => goToStep(2)}>
                    Back
                  </button>
                  <button type="submit" className="Checkout-page-btn Checkout-page-btn-submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="Checkout-page-summary">
            <div className="Checkout-page-summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="Checkout-page-summary-products">
              {cartItems.map(item => (
                <div key={item.id} className="Checkout-page-summary-product">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="Checkout-page-summary-totals">
              <div className="Checkout-page-summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="Checkout-page-summary-row">
                <span>Shipping:</span>
                <span>${shippingCharge.toFixed(2)}</span>
              </div>
              <div className="Checkout-page-summary-row">
                <span>Tax (8%):</span>
                <span>${(calculateSubtotal() * taxRate).toFixed(2)}</span>
              </div>
              <div className="Checkout-page-summary-row total">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
