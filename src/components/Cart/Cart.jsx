import React from 'react';
import { useCart } from "../../context/cartContext";
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const shippingCharge = 15.00;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCharge;
  };

  const proceedToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="shopping-cart-container">
      <h1>Your Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length > 0 ? (
            <>
              <div className="cart-header">
                <div className="product-header">Product</div>
                <div className="price-header">Price</div>
                <div className="quantity-header">Quantity</div>
                <div className="total-header">Total</div>
              </div>
              
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="product-info">
                    <div className="product-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="product-details">
                      <h3>{item.name}</h3>
                      <button 
                        className="remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <span className="remove-icon">🗑</span> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="price">
                    NPR {item.price.toLocaleString()}
                  </div>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="cart-actions">
                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
                <button 
                  className="continue-shopping" 
                  onClick={() => window.location.href = '/'}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={() => window.location.href = '/'}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>NPR {calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>NPR {shippingCharge.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>NPR {calculateTotal().toLocaleString()}</span>
          </div>
          
          <button 
            className="checkout-btn" 
            onClick={proceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>
          
          <div className="additional-info">
            <p>Free shipping on all orders over NPR 200</p>
            <p>30-day money-back guarantee</p>
            <p>Secure payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;