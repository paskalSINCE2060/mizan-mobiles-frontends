import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartTax,
  clearCart
} from '../../slice/cartSlice';
import './Checkout.css';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Form state for customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 3000);
    } else {
      // Pre-populate form with user data if available
      setCustomerDetails(prev => ({
        ...prev,
        name: storedUser.name || '',
        email: storedUser.email || ''
      }));
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
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'zipCode'];
    for (let field of required) {
      if (!customerDetails[field].trim()) {
        alert(`Please fill in ${field.charAt(0).toUpperCase() + field.slice(1)}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      
      // Process images URLs before sending to backend
      const processedCartItems = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        image: item.image.startsWith('http') 
          ? item.image 
          : `https://mizan.com.np${item.image}`,
        price: item.price,
        quantity: item.quantity,
        ...(item.specialOffer && {
          specialOffer: {
            id: item.specialOffer.id,
            title: item.specialOffer.title,
            discountPercentage: item.discountPercentage
          }
        })
      }));

      const orderData = {
        user: storedUser._id || storedUser.id,
        customerDetails,
        products: processedCartItems,
        pricing: {
          subtotal,
          shipping,
          tax,
          total
        },
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      };

      const response = await fetch('/api/checkout-orders/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart after successful order
        dispatch(clearCart());
        setOrderSuccess(true);
        
        // Show success message and redirect after delay
        setTimeout(() => {
          navigate('/orders'); // Redirect to user orders page
        }, 3000);
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
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

  if (orderSuccess) {
    return (
      <div className="Checkout-page">
        <div className="Checkout-page-container" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Order Placed Successfully!</h2>
          <p style={{ marginBottom: '10px' }}>Thank you for your order. We'll contact you soon to confirm delivery details.</p>
          <p style={{ marginBottom: '20px', color: '#666' }}>Order Total: NPR {total.toLocaleString()}</p>
          <p style={{ color: '#666' }}>Payment Method: Cash on Delivery</p>
          <div style={{ marginTop: '30px' }}>
            <p>Redirecting to your orders page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Checkout-page">
      <Toast message="Please login to checkout!" show={showToast} />

      <div className="Checkout-page-container" id="checkout-container">
        <div className="Checkout-page-checkout-content">
          
          {/* Customer Details Form */}
          <div className="checkout-form" style={{ flex: '2', marginRight: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Delivery Information</h3>
            
            <form style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerDetails.city}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={customerDetails.zipCode}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any special instructions for delivery..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </form>

            {/* Payment Method Info */}
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ marginBottom: '10px', color: '#495057' }}>Payment Method</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>💵</span>
                <div>
                  <strong>Cash on Delivery</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                    Pay when your order is delivered to your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="Checkout-page-summary" style={{ flex: '1' }}>
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
                {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </button>
              <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#666' }}>
                You will pay when the order is delivered to your address
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;