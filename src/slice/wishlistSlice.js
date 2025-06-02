import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find(i => i.id === item.id)
      
      if (!existingItem) {
        state.items.push({
          ...item,
          addedAt: new Date().toISOString()
        })
      }
    },
    
    removeFromWishlist: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter(item => item.id !== itemId)
    },
    
    clearWishlist: (state) => {
      state.items = []
    },
    
    updateWishlistItem: (state, action) => {
      const { id, updates } = action.payload
      const item = state.items.find(i => i.id === id)
      
      if (item) {
        Object.assign(item, updates)
      }
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },

    loadWishlistFromStorage: (state, action) => {
      state.items = action.payload || []
    }
  }
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  updateWishlistItem,
  setLoading,
  setError,
  loadWishlistFromStorage
} = wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsInWishlist = (state, itemId) => 
  state.wishlist.items.some(item => item.id === itemId)
export const selectWishlistLoading = (state) => state.wishlist.loading
export const selectWishlistError = (state) => state.wishlist.error

export default wishlistSlice.reducer
