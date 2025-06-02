// cartMiddleware.js
export const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save cart to localStorage after any cart action
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    try {
      const cartItems = state.cart.cartItems;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
  
  return result;
};

// Utility function to load cart from localStorage
export const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cartItems');
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};