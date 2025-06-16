import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  removeSpecificItem,
  updateQuantity, 
  updateSpecificQuantity,
  clearCart,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartShipping,
  selectCartTax
} from '../../slice/cartSlice'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);

  const handleRemoveFromCart = (item) => {
    if (item.specialOffer) {
      dispatch(removeSpecificItem({ id: item.id, offerId: item.specialOffer.id }));
    } else {
      dispatch(removeFromCart(item.id));
    }
    toast.success("Item removed from cart", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity > 0) {
      if (item.specialOffer) {
        dispatch(updateSpecificQuantity({ id: item.id, offerId: item.specialOffer.id, quantity }));
      } else {
        dispatch(updateQuantity({ id: item.id, quantity }));
      }
      toast.info("Quantity updated", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success("Cart cleared", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  const continueShopping = () => {
    navigate('/');
  };

  const goToOffers = () => {
    navigate('/specialoffers');
  };

  return (
    <div className="cart-items-shopping-cart-container">
      <h1>Your Shopping Cart</h1>
      
      <div className="cart-items-cart-content">
        <div className="cart-items-cart-items">
          {cartItems.length > 0 ? (
            <>
              <div className="cart-items-cart-header">
                <div className="cart-items-product-header">Product</div>
                <div className="cart-items-price-header">Price</div>
                <div className="cart-items-quantity-header">Quantity</div>
                <div className="cart-items-total-header">Total</div>
              </div>
              
              {cartItems.map(item => {
                const key = `${item.id}-${item.specialOffer?.id || 'nooffer'}`;
                return (
                  <div key={key} className="cart-items-cart-item">
                    <div className="cart-items-product-info">
                      <div className="cart-items-product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-items-product-details">
                        <h3>{item.name}</h3>
                        {item.discountApplied && (
                          <div className="cart-items-special-offer">
                            <span className="cart-items-offer-badge">SPECIAL OFFER</span>
                            <span className="cart-items-discount-text">
                              {item.discountPercentage}% OFF
                            </span>
                          </div>
                        )}
                        {item.specialOffer && (
                          <div className="cart-items-offer-title">
                            <span className="cart-items-offer-name">
                              {item.specialOffer.title}
                            </span>
                          </div>
                        )}
                        {item.promoCode && (
                          <div className="cart-items-promo-code">
                            Promo: {item.promoCode}
                          </div>
                        )}
                        <button 
                          className="cart-items-remove-btn" 
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          <span className="cart-items-remove-icon">🗑</span> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-items-price">
                      {item.originalPrice && item.originalPrice !== item.price ? (
                        <>
                          <span className="cart-items-original-price">
                            NPR {item.originalPrice.toLocaleString()}
                          </span>
                          <span className="cart-items-discounted-price">
                            NPR {item.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>NPR {item.price.toLocaleString()}</>
                      )}
                    </div>
                    
                    <div className="cart-items-quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-items-item-total">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
              
              <div className="cart-items-cart-actions">
                <button className="cart-items-clear-cart" onClick={handleClearCart}>
                  Clear Cart
                </button>
                <button 
                  className="cart-items-continue-shopping" 
                  onClick={continueShopping}
                >
                  Continue Shopping
                </button>
                <button 
                  className="cart-items-special-offers" 
                  onClick={goToOffers}
                >
                  View Special Offers
                </button>
              </div>
            </>
          ) : (
            <div className="cart-items-empty-cart">
              <div className="cart-items-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <div className="cart-items-empty-actions">
                <button onClick={continueShopping}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="cart-items-order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items-summary-row">
            <span>Subtotal</span>
            <span>NPR {subtotal.toLocaleString()}</span>
          </div>
          <div className="cart-items-summary-row">
            <span>Shipping</span>
            <span>NPR {shipping.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div className="cart-items-summary-row">
            <span>Tax (8%)</span>
            <span>NPR {tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div className="cart-items-summary-row cart-items-total">
            <span>Total</span>
            <span>NPR {total.toLocaleString()}</span>
          </div>
          
          {cartItems.some(item => item.discountApplied) && (
            <div className="cart-items-active-promotions">
              <h3>Active Promotions</h3>
              {cartItems
                .filter(item => item.discountApplied)
                .map(item => {
                  const key = `promo-${item.id}-${item.specialOffer?.id || 'nooffer'}`;
                  return (
                    <div key={key} className="cart-items-promotion-item">
                      <span>{item.specialOffer?.title || `${item.discountPercentage}% Off`}</span>
                      <span className="cart-items-savings">
                        -NPR {((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              <div className="cart-items-total-savings">
                <strong>
                  Total Savings: NPR {cartItems
                    .filter(item => item.discountApplied)
                    .reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0)
                    .toLocaleString()}
                </strong>
              </div>
            </div>
          )}
          
          <button 
            className="cart-items-checkout-btn" 
            onClick={proceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>
          
          <div className="cart-items-additional-info">
            <p>✓ Free shipping on all orders over NPR 200</p>
            <p>✓ 30-day money-back guarantee</p>
            <p>✓ Secure payments</p>
            <p>✓ 24/7 customer support</p>
          </div>
          
          <div className="cart-items-promo-banner">
            <h4>🎉 Don't miss out!</h4>
            <p>Check out our special offers for more savings</p>
            <button onClick={goToOffers} className="cart-items-promo-btn">
              View All Offers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
