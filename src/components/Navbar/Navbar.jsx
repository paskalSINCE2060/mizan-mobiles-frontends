// src/components/Navbar.js
import React, { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCart } from '../../context/cartContext';
import "./Navbar.css";

function Navbar({ userData, setUserData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleServicesClick = () => {
    navigate("/");
    setTimeout(() => {
      const serviceSection = document.getElementById("services");
      if (serviceSection) {
        serviceSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert("Searching for: " + searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUserData(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">MIZAN MOBILE</div>
      <div className={`menu-icon ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <FaSearch />
        </button>
      </form>
      
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/categories">Categories</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/contact">Contact</RouterLink></li>
        <li><button onClick={handleServicesClick} className="nav-button">Services</button></li>
      </ul>
      
      <div className="right-icons">
        {userData ? (
          <>
            <RouterLink to="/profile"><FaUser /></RouterLink>
            <RouterLink to="/cart" className="cart-icon">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </RouterLink>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <div className="auth-links">
            <RouterLink to="/login">Login</RouterLink> | <RouterLink to="/signup">Signup</RouterLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;