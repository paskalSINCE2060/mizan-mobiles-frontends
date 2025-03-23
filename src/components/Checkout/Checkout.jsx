import { useState } from 'react';
import './Checkout.css';
import { CreditCard, Truck, User, CheckCircle, ChevronRight } from 'lucide-react';

const Checkout = () => {
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
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    return formData.cardNumber.trim() !== '' && formData.cardExpiry.trim() !== '' && formData.cardCvv.trim() !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setOrderPlaced(true);
    }
  };

  const getProgressWidth = () => {
    if (currentStep === 2) return '50%';
    if (currentStep === 3) return '100%';
    return '0%';
  };

  return (
    <div className="Checkout-page">
      <header className="Checkout-page-header">
        <div className="Checkout-page-container">
          <h1>Checkout</h1>
        </div>
      </header>

      {!orderPlaced ? (
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
                <div className={`Checkout-page-step-content ${currentStep === 1 ? 'active' : ''}`} data-step="1">
                  <div className="Checkout-page-step-header">
                    <div className="Checkout-page-step-icon">
                      <User />
                    </div>
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

                <div className={`Checkout-page-step-content ${currentStep === 2 ? 'active' : ''}`} data-step="2">
                  <div className="Checkout-page-step-header">
                    <div className="Checkout-page-step-icon">
                      <Truck />
                    </div>
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
                      <label htmlFor="zipCode" className="Checkout-page-form-label">ZIP Code</label>
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
                    <button type="button" className="Checkout-page-btn Checkout-page-btn-back" onClick={() => goToStep(1)}>Back</button>
                    <button type="button" className="Checkout-page-btn Checkout-page-btn-next" onClick={() => goToStep(3)}>
                      Continue
                      <ChevronRight />
                    </button>
                  </div>
                </div>

                <div className={`Checkout-page-step-content ${currentStep === 3 ? 'active' : ''}`} data-step="3">
                  <div className="Checkout-page-step-header">
                    <div className="Checkout-page-step-icon">
                      <CreditCard />
                    </div>
                    <h2 className="Checkout-page-step-heading">Payment Information</h2>
                  </div>

                  <div className="Checkout-page-form-group">
                    <label htmlFor="cardNumber" className="Checkout-page-form-label">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber" 
                      className="Checkout-page-form-input" 
                      placeholder="•••• •••• •••• ••••" 
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
                        placeholder="•••" 
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="Checkout-page-form-buttons">
                    <button type="button" className="Checkout-page-btn Checkout-page-btn-back" onClick={() => goToStep(2)}>Back</button>
                    <button type="submit" className="Checkout-page-btn Checkout-page-btn-next">
                      Place Order
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="Checkout-page-order-summary">
              <h2 className="Checkout-page-summary-title">Order Summary</h2>
              <div className="Checkout-page-summary-items">
                <div className="Checkout-page-summary-item">
                  <div>
                    <span className="Checkout-page-item-name">Smartphone X</span>
                    <span className="Checkout-page-item-quantity">x1</span>
                  </div>
                  <span>$699.99</span>
                </div>
                <div className="Checkout-page-summary-item">
                  <div>
                    <span className="Checkout-page-item-name">Protective Case</span>
                    <span className="Checkout-page-item-quantity">x1</span>
                  </div>
                  <span>$24.99</span>
                </div>
                <div className="Checkout-page-summary-item">
                  <div>
                    <span className="Checkout-page-item-name">Screen Protector</span>
                    <span className="Checkout-page-item-quantity">x2</span>
                  </div>
                  <span>$25.98</span>
                </div>
              </div>

              <div className="Checkout-page-summary-totals">
                <div className="Checkout-page-summary-item">
                  <span className="Checkout-page-summary-item-label">Subtotal</span>
                  <span>$750.96</span>
                </div>
                <div className="Checkout-page-summary-item">
                  <span className="Checkout-page-summary-item-label">Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="Checkout-page-summary-item">
                  <span className="Checkout-page-summary-item-label">Tax</span>
                  <span>$60.08</span>
                </div>
                <div className="Checkout-page-summary-item">
                  <span>Total</span>
                  <span>$821.03</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="Checkout-page-container Checkout-page-success-container">
          <div className="Checkout-page-success-icon">
            <CheckCircle size={80} />
          </div>
          <h2 className="Checkout-page-success-title">Thank You!</h2>
          <p className="Checkout-page-success-message">Your order has been placed successfully.<br />Order confirmation has been sent to your email.</p>
          <a href="/" className="Checkout-page-btn-continue">Continue Shopping</a>
        </div>
      )}
    </div>
  );
};

export default Checkout;