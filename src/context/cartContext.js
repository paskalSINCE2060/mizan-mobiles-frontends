import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
      // If product exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // If product is new, add to cart with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    // If new quantity is 0 or less, remove the item
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update the quantity of the specific item
    const updatedCart = cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );

    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: cartItems.reduce((total, item) => total + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);