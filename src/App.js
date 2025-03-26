import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

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
      </Routes>
      <Footer />
    </Router>
    </CartProvider>
  );
}

export default App;