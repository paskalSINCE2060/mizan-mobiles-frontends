import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadCartFromStorage } from "./slice/cartSlice";
import { loadWishlistFromStorage } from "./slice/wishlistSlice";
import { refreshTokenThunk } from "./slice/refreshTokenThunk";
import { loginSuccess, logout } from "./slice/authSlice";
import { getTokenExpiration } from "./utils/authUtils";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Homepage from "./components/HomePage/Homepage";
import CategoryPage from "./components/Category/Category";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import Signup from "./components/signup/Signup";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import { CartProvider } from "./context/cartContext";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import SmartPhone from "./components/SmartPhone/SmartPhone";
import Watches from "./components/Watches/Watches";
import Tablets from "./components/Tablets/Tablets";
import Airpods from "./components/Airpods/Airpods";
import SellYourPhone from "./components/SellYourPhone/SellYourPhone";
import RepairPhones from "./components/RepairPhones/RepairPhones";
import BookingPage from "./components/BookYourPhone/index";
import SpecialOffers from "./components/SpecialOffers/SpecialOffers";
import Wishlist from "./components/Wishlist/wishlist";
import ProductList from "./components/ProductList/ProductList";
import AddProduct from "./components/AddProduct/AddProduct";
import EditProduct from "./components/EditProduct/EditProduct";
import PaymentSuccess from "./pages/payment-success";
import AdminAddProduct from "./components/AdminAddProduct/AdminAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRouteGuard from "./components/AdminRouteGuard/AdminRouteGuard";

import RequireAuth from "./components/common/RequireAuth";

function AppContent() {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  // Initialize auth state from localStorage (run only once on mount)
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
        // Only dispatch if Redux state is not already set
        if (!user || !token) {
          dispatch(loginSuccess({ 
            token: storedToken, 
            user: parsedUser,
            refreshToken: localStorage.getItem("refreshToken")
          }));
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      }
    }

    // Load cart and wishlist (only on initial mount)
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    dispatch(loadCartFromStorage(savedCart));

    const savedWishlist = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    dispatch(loadWishlistFromStorage(savedWishlist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Only depend on dispatch to avoid infinite loops

  // Separate effect to handle localStorage/Redux state sync
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    // If no token in localStorage but Redux has auth data, clear Redux
    if (!storedToken && (user || token)) {
      dispatch(logout());
      setUserData(null);
    }
  }, [dispatch, token, user]);

  // Sync userData with Redux user state
  useEffect(() => {
    if (user && isAuthenticated) {
      setUserData(user);
    } else if (!isAuthenticated) {
      setUserData(null);
    }
  }, [user, isAuthenticated]);

  // Token refresh logic
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const expiry = getTokenExpiration(token);
    const now = Date.now();

    if (!expiry) return;

    const timeUntilExpiry = expiry - now;

    if (timeUntilExpiry <= 0) {
      dispatch(refreshTokenThunk());
    } else {
      const refreshTimer = setTimeout(() => {
        dispatch(refreshTokenThunk());
      }, timeUntilExpiry - 5000);

      return () => clearTimeout(refreshTimer);
    }
  }, [token, isAuthenticated, dispatch]);

  return (
    <CartProvider>
      <Router>
        <Navbar userData={userData} setUserData={setUserData} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/add-product"
            element={
              <AdminRouteGuard>
                <AdminAddProduct />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            }
          />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Auth Routes - Redirect if already logged in */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setUserData={setUserData} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <Signup />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          {/* Protected routes wrapped in RequireAuth */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />

          {/* Public routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetails" element={<ProductDetails />} />
          <Route path="/smartphone" element={<SmartPhone />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/tablets" element={<Tablets />} />
          <Route path="/airpods" element={<Airpods />} />
          <Route path="/sellyourphone" element={<SellYourPhone />} />
          <Route path="/repair" element={<RepairPhones />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/specialoffers" element={<SpecialOffers />} />
          <Route path="/bookyourphone" element={<BookingPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </CartProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;