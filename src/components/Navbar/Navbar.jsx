import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check login status when component mounts
  useEffect(() => {
    // Check if user is logged in (example using localStorage)
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

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
    // Clear authentication token
    localStorage.removeItem('authToken');
    
    // Clear other user-related data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Update login state
    setIsLoggedIn(false);

    // Redirect to login page
    navigate("/login");
  };

  // Simulated login function (you would typically call this after successful authentication)
  const handleLogin = () => {
    // Simulate setting an auth token
    localStorage.setItem('authToken', 'your-auth-token');
    setIsLoggedIn(true);
    navigate("/");
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
        {isLoggedIn ? (
          <>
            <a href="/profile"><FaUser /></a>
            <a href="/cart"><FaShoppingCart /></a>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <div className="auth-links">
            <RouterLink to="/login">Login</RouterLink> | <RouterLink to="/signup">Signup</RouterLink>
          </div>
        )}
      </div>

      {/* Optional: For testing login state (remove in production) */}
      {!isLoggedIn && (
        <button onClick={handleLogin} style={{position: 'absolute', bottom: '10px', right: '10px'}}>
          Test Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;