import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../slice/cartSlice'
import wishlistReducer from '../slice/wishlistSlice'
import { cartMiddleware } from '../utils/cartMiddleware'
import { wishlistMiddleware } from '../utils/wishlistMuddleware'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware, wishlistMiddleware),
})