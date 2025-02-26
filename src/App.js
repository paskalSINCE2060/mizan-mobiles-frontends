import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Homepage from "./components/HomePage/Homepage";
import CategoryPage from "./components/Category/Category";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import Signup from "./components/signup/Signup";

// import ContactPage from "./components/ContactPage/Contact";
// import ServicesPage from "./components/ServicesPage/Services";

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/about" element={<AboutUs/>} />
           <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
