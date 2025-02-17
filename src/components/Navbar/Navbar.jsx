import React, { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";  // Import Link
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert("Searching for: " + searchQuery);
    // You can replace the alert with actual search logic or redirect
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
        <li><Link to="/">Home</Link></li>  
        <li><Link to="/categories">Categories</Link></li>  
        <li><Link to="/about">About</Link></li>  
        <li><Link to="/contact">Contact</Link></li> 
        <li><Link to="/services">Services</Link></li>  
      </ul>

      
      <div className="right-icons">
        <FaUser />
        <FaShoppingCart />
        <div className="auth-links">
          <Link to="#login">Login</Link> | <Link to="#signup">Signup</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
