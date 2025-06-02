import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux"; 
import { store } from "./store"; 
import { loadCartFromStorage } from "./slice/cartSlice"; 
import { loadWishlistFromStorage } from "./slice/wishlistSlice";
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

function AppContent() {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUserData(storedUser);
    }

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    dispatch(loadCartFromStorage(savedCart));

    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    dispatch(loadWishlistFromStorage(savedWishlist));
  }, [dispatch]);

  

  return (
    <CartProvider>
      <Router>
        <Navbar userData={userData} setUserData={setUserData} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/login"
            element={!userData ? <Login setUserData={setUserData} /> : <Navigate to="/" />}
          />
          <Route 
            path="/signup" 
            element={!userData ? <Signup /> : <Navigate to="/" />} 
          />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route
            path="/profile"
            element={userData ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/productdetails" element={<ProductDetails />} />
          <Route path="/smartphone" element={<SmartPhone />} />
          <Route path="/watches" element={<Watches/>} />
          <Route path="/tablets" element={<Tablets/>} />
          <Route path="/airpods" element={<Airpods/>} />
          <Route path="/sellyourphone" element={<SellYourPhone/>} />
          <Route path="/repair" element={<RepairPhones/>} />
          <Route path="/booking" element={<BookingPage/>} />
          <Route path="/specialoffers" element={<SpecialOffers/>} />
          <Route path="/bookyourphone" element={<BookingPage/>} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer />
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