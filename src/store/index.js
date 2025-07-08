import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../slice/cartSlice'
import wishlistReducer from '../slice/wishlistSlice'
import authReducer from '../slice/authSlice'
import sellPhoneReducer from '../slice/sellPhoneSlice'
import phoneOrderReducer from '../slice/phoneOrderSlice'
import checkoutOrdersReducer from '../slice/checkoutOrdersSlice'
import productsReducer from '../slice/productsSlice' // Add the products slice
import { cartMiddleware } from '../utils/cartMiddleware'
import { wishlistMiddleware } from '../utils/wishlistMuddleware'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    sellPhone: sellPhoneReducer,
    phoneOrders: phoneOrderReducer,
    checkoutOrders: checkoutOrdersReducer,
    products: productsReducer, // Add products reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware, wishlistMiddleware),
})