import React, { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-scroll";  // Import Link from react-scroll
import { Link as RouterLink } from "react-router-dom";  // Import Link for routing
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

const handleServicesClick = () => {
  navigate("/"); // Navigate to homepage
  setTimeout(() => {
    const serviceSection = document.getElementById("services");
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: "smooth" });
    }
  }, 100); // Delay ensures homepage loads first
};


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert("Searching for: " + searchQuery);
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
        <FaUser />
        <FaShoppingCart />
        <div className="auth-links">
          <RouterLink to="#login">Login</RouterLink> | <RouterLink to="#signup">Signup</RouterLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
