import React from 'react';
import { useCart } from '../../context/cartContext';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    calculateSubtotal,
    calculateTotal
  } = useCart();

  const proceedToCheckout = () => {
    window.location.href = '/checkout';
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
              
              {cartItems.map(item => (
                <div key={item.id} className="cart-items-cart-item">
                  <div className="cart-items-product-info">
                    <div className="cart-items-product-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-items-product-details">
                      <h3>{item.name}</h3>
                      <button 
                        className="cart-items-remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <span className="cart-items-remove-icon">🗑</span> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-items-price">
                    NPR {item.price.toLocaleString()}
                  </div>
                  
                  <div className="cart-items-quantity-controls">
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
                  
                  <div className="cart-items-item-total">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="cart-items-cart-actions">
                <button className="cart-items-clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
                <button 
                  className="cart-items-continue-shopping" 
                  onClick={() => window.location.href = '/'}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <div className="cart-items-empty-cart">
              <p>Your cart is empty</p>
              <button onClick={() => window.location.href = '/'}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
        
        <div className="cart-items-order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items-summary-row">
            <span>Subtotal</span>
            <span>NPR {calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="cart-items-summary-row">
            <span>Shipping</span>
            <span>NPR 15.00</span>
          </div>
          <div className="cart-items-summary-row">
            <span>Tax</span>
            <span>NPR {(calculateSubtotal() * 0.08).toLocaleString()}</span>
          </div>
          <div className="cart-items-summary-row cart-items-total">
            <span>Total</span>
            <span>NPR {calculateTotal().toLocaleString()}</span>
          </div>
          
          <button 
            className="cart-items-checkout-btn" 
            onClick={proceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>
          
          <div className="cart-items-additional-info">
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