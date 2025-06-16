import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../slice/cartSlice'
import wishlistReducer from '../slice/wishlistSlice'
import authReducer from '../slice/authSlice'
import sellPhoneReducer from '../slice/sellPhoneSlice' // Add this new slice
import { cartMiddleware } from '../utils/cartMiddleware'
import { wishlistMiddleware } from '../utils/wishlistMuddleware'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    sellPhone: sellPhoneReducer, // Add sell phone reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware, wishlistMiddleware),
})