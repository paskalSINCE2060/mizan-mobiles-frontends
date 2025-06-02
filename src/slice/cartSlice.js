import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { 
        id, 
        name, 
        price, 
        image, 
        quantity = 1,
        specialOffer = null,  // Add specialOffer parameter
        originalPrice = null, // Add originalPrice parameter
        promoCode = null      // Add promoCode parameter
      } = action.payload;
      
      // Find existing item with same ID and same special offer
      const existingItem = state.cartItems.find(cartItem => 
        cartItem.id === id && 
        cartItem.specialOffer?.id === specialOffer?.id
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          id,
          name,
          price,
          originalPrice: originalPrice || price, // Store original price
          image,
          quantity,
          specialOffer,
          promoCode,
          addedAt: Date.now(),
          // Keep existing discount fields for backward compatibility
          discountApplied: specialOffer ? true : false,
          discountPercentage: specialOffer ? specialOffer.discount : 0
        });
      }
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    },
    
    // Load cart from localStorage on app start
    loadCartFromStorage: (state, action) => {
      state.cartItems = action.payload || [];
    },
    
    // Apply promo code to cart items (enhanced to work with special offers)
    applyPromoCode: (state, action) => {
      const { promoCode, discountPercentage } = action.payload;
      state.cartItems = state.cartItems.map(item => {
        // Don't apply promo if item already has special offer
        if (item.specialOffer) {
          return item;
        }
        
        return {
          ...item,
          promoCode: promoCode,
          discountApplied: true,
          discountPercentage: discountPercentage,
          originalPrice: item.originalPrice || item.price,
          price: (item.originalPrice || item.price) * (1 - discountPercentage / 100)
        };
      });
    },
    
    // Remove promo code from cart (enhanced to preserve special offers)
    removePromoCode: (state) => {
      state.cartItems = state.cartItems.map(item => {
        // Don't remove promo from items with special offers
        if (item.specialOffer) {
          return item;
        }
        
        return {
          ...item,
          promoCode: null,
          discountApplied: false,
          discountPercentage: 0,
          price: item.originalPrice || item.price
        };
      });
    },
    
    // New: Remove specific item by ID and offer ID
    removeSpecificItem: (state, action) => {
      const { id, offerId } = action.payload;
      state.cartItems = state.cartItems.filter(item => 
        !(item.id === id && item.specialOffer?.id === offerId)
      );
    },
    
    // New: Update quantity for specific item with offer
    updateSpecificQuantity: (state, action) => {
      const { id, offerId, quantity } = action.payload;
      const item = state.cartItems.find(item => 
        item.id === id && item.specialOffer?.id === offerId
      );
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    }
  },
})

// Enhanced Selector functions
export const selectCartItems = (state) => state.cart.cartItems

export const selectCartItemsCount = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state)
  const shipping = subtotal > 200 ? 0 : 15.00 // Free shipping over NPR 200
  const tax = subtotal * 0.08
  return subtotal + shipping + tax
}

export const selectCartTotalSavings = (state) =>
  state.cart.cartItems
    .filter(item => item.discountApplied || item.specialOffer)
    .reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      const savings = (originalPrice - item.price) * item.quantity;
      return total + savings;
    }, 0)

export const selectCartShipping = (state) => {
  const subtotal = selectCartSubtotal(state)
  return subtotal > 200 ? 0 : 15.00
}

export const selectCartTax = (state) => {
  const subtotal = selectCartSubtotal(state)
  return subtotal * 0.08
}

// New selectors for special offers
export const selectSpecialOfferItems = (state) =>
  state.cart.cartItems.filter(item => item.specialOffer)

export const selectRegularItems = (state) =>
  state.cart.cartItems.filter(item => !item.specialOffer)

export const selectTotalSpecialOfferSavings = (state) =>
  state.cart.cartItems
    .filter(item => item.specialOffer)
    .reduce((total, item) => {
      const savings = (item.originalPrice - item.price) * item.quantity;
      return total + savings;
    }, 0)

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
  applyPromoCode,
  removePromoCode,
  removeSpecificItem,
  updateSpecificQuantity
} = cartSlice.actions

export default cartSlice.reducer