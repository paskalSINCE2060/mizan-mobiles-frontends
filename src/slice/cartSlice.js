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
        _id,  // <- use _id here from backend
        name, 
        price, 
        image, 
        quantity = 1,
        specialOffer = null,  
        originalPrice = null, 
        promoCode = null      
      } = action.payload;
      
      // Find existing item by matching internal id with _id
      const existingItem = state.cartItems.find(cartItem => 
        cartItem.id === _id && 
        cartItem.specialOffer?.id === specialOffer?.id
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          id: _id,   // Store _id as id internally
          name,
          price,
          originalPrice: originalPrice || price,
          image,
          quantity,
          specialOffer,
          promoCode,
          addedAt: Date.now(),
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
    
    loadCartFromStorage: (state, action) => {
      state.cartItems = action.payload || [];
    },
    
    applyPromoCode: (state, action) => {
      const { promoCode, discountPercentage } = action.payload;
      state.cartItems = state.cartItems.map(item => {
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
    
    removePromoCode: (state) => {
      state.cartItems = state.cartItems.map(item => {
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
    
    removeSpecificItem: (state, action) => {
      const { id, offerId } = action.payload;
      state.cartItems = state.cartItems.filter(item => 
        !(item.id === id && item.specialOffer?.id === offerId)
      );
    },
    
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

// Selectors (unchanged)
export const selectCartItems = (state) => state.cart.cartItems

export const selectCartItemsCount = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state)
  const shipping = subtotal > 200 ? 0 : 15.00
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
