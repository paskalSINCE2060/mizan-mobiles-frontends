import React, { useState } from 'react';
import GalaxyBuds from "../../assets/GalaxyBuds3.jpeg"
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Organic Bananas, Bunch',
      category: 'Fruits',
      price: 3.99,
      quantity: 2,
      image: {GalaxyBuds}
    },
    {
      id: 2,
      name: 'Organic Avocados, Ripe',
      category: 'Fruits',
      price: 7.99,
      quantity: 1,
      image: {GalaxyBuds}
    },
    {
      id: 3,
      name: 'Organic Broccoli',
      category: 'Vegetables',
      price: 3.49,
      quantity: 3,
      image: {GalaxyBuds}
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const shippingCharge = 15.00;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCharge;
  };

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const proceedToCheckout = () => {
    window.location.href = '/checkout';
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    alert(`Coupon code "${couponCode}" applied!`);
    setCouponCode('');
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
                      <p>{item.category}</p>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        <span className="remove-icon">🗑</span> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="price">
                    RS{item.price.toFixed(2)}
                  </div>
                  
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  
                  <div className="item-total">
                    RS{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="cart-actions">
                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="continue-shopping" onClick={() => window.location.href = '/'}>
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
            </div>
          )}
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>RS{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>RS{shippingCharge.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>RS{calculateTotal().toFixed(2)}</span>
          </div>
          
          <div className="coupon-section">
            <h3>Coupon Code</h3>
            <div className="coupon-input">
              <input 
                type="text" 
                placeholder="Enter coupon" 
                value={couponCode}
                onChange={handleCouponChange}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
          </div>
          
          <button 
            className="checkout-btn" 
            onClick={proceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>
          
          <div className="additional-info">
            <p>Free shipping on all orders over RS200</p>
            <p>30-day money-back guarantee</p>
            <p>Secure payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;