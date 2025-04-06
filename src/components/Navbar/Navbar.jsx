import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../../context/cartContext';
import "./Navbar.css";

function Navbar({ userData, setUserData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRecommendations, setSearchRecommendations] = useState([]);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track current route
  const navRef = useRef(null);
  const searchRef = useRef(null);

  const allProducts = [
    { id: 'iphone14-256gb', name: 'Apple iPhone 14 Pro Max [256GB]', category: 'iPhone', image: '/path/to/iphone14.jpg', discountedPrice: 111500.00 },
    { id: 'iphone13pro-256gb', name: 'Apple iPhone 13 Pro Max [256GB]', category: 'iPhone', image: '/path/to/iphone13pro.jpg', discountedPrice: 91500.00 },
    { id: 'iphone13promax-128gb', name: 'Apple iPhone 13 Pro Max [128GB]', category: 'iPhone', image: '/path/to/iphone13promax.jpg', discountedPrice: 85500.00 },
    { id: 'iphone11promax-512gb', name: 'Apple iPhone 11 Pro Max [512GB]', category: 'iPhone', image: '/path/to/iphone11promax.jpg', discountedPrice: 53500.00 },
    { id: 'galaxy-watch-ultra', name: 'Galaxy Watch Ultra (LTE, 47mm)', category: 'Galaxy Watch', image: '/path/to/galaxywatchultra.jpg', discountedPrice: 691.60 },
    { id: 'galaxy-buds-3-pro', name: 'Galaxy Buds3 Pro', category: 'Galaxy Buds', image: '/path/to/galaxybuds3pro.jpg', discountedPrice: 250.60 },
    { id: 'galaxy-buds-3', name: 'Galaxy Buds3', category: 'Galaxy Buds', image: '/path/to/galaxybuds3.jpg', discountedPrice: 180.60 },
    { id: 'galaxy-watch-7', name: 'Galaxy Watch7 (Bluetooth, 44mm)', category: 'Galaxy Watch', image: '/path/to/galaxywatch7.jpg', discountedPrice: 348.60 }
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const recommendations = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchRecommendations(recommendations);
    } else {
      setSearchRecommendations([]);
    }
  }, [searchQuery]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      
      if (searchRecommendations.length > 0 && 
          searchRef.current && 
          !searchRef.current.contains(event.target)) {
        setSearchRecommendations([]);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, searchRecommendations.length]);

  // Close menu on window resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    }
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToServices = () => {
    navigate("/"); // Make sure you're on the homepage
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close menu after click
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchRecommendations.length > 0) {
      navigate('/search', { state: { query: searchQuery } });
      setSearchRecommendations([]);
      setSearchQuery('');
    } else {
      alert("No products found matching your search.");
    }
  };

  const handleSearchRecommendationClick = (product) => {
    navigate('/productdetails', { state: { product } });
    setSearchRecommendations([]);
    setSearchQuery('');
    setIsOpen(false); // Close menu if open
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUserData(null);
    navigate("/login");
  };

  // Function to check if a link is active
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Check if we're on the homepage and services section is active
  const [isServicesActive, setIsServicesActive] = useState(false);
  
  useEffect(() => {
    const checkIfServicesActive = () => {
      if (location.pathname === '/') {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          const rect = servicesSection.getBoundingClientRect();
          const isVisible = 
            rect.top >= 0 &&
            rect.bottom <= window.innerHeight;
          setIsServicesActive(isVisible);
        }
      } else {
        setIsServicesActive(false);
      }
    };
    
    window.addEventListener('scroll', checkIfServicesActive);
    checkIfServicesActive(); // Check initially
    
    return () => window.removeEventListener('scroll', checkIfServicesActive);
  }, [location.pathname]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="top-section">
        <div className="logo">MIZAN MOBILE</div>
        
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>
          
          {searchRecommendations.length > 0 && (
            <div className="search-recommendations">
              {searchRecommendations.map((product, index) => (
                <div 
                  key={index} 
                  className="recommendation-item"
                  onClick={() => handleSearchRecommendationClick(product)}
                >
                  <img src={product.image} alt={product.name} className="recommendation-item-img" />
                  <div className="recommendation-item-text">
                    <p>{product.name}</p>
                    <p>NPR {product.discountedPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="right-icons">
          {userData ? (
            <>
              <RouterLink to="/profile" className={isLinkActive('/profile') ? 'active-link' : ''}>
                <FaUser />
              </RouterLink>
              <RouterLink to="/cart" className={`cart-icon ${isLinkActive('/cart') ? 'active-link' : ''}`}>
                <FaShoppingCart />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </RouterLink>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <div className="auth-links">
              <RouterLink to="/login" className={isLinkActive('/login') ? 'active-link' : ''}>Login</RouterLink> | 
              <RouterLink to="/signup" className={isLinkActive('/signup') ? 'active-link' : ''}>Signup</RouterLink>
            </div>
          )}
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      <div className="bottom-section">
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <RouterLink 
              to="/" 
              className={isLinkActive('/') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/categories" 
              className={isLinkActive('/categories') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              Categories
            </RouterLink>
          </li>
         
          <li>
            <RouterLink 
              to="/sellyourphone" 
              className={isLinkActive('/sellyourphone') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              Sell Phone
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/repair" 
              className={isLinkActive('/repair') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              Repair
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/specialoffers" 
              className={isLinkActive('/specialoffers') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              SpecialOffers
            </RouterLink>
          </li>
          <li>
            <button 
              onClick={handleScrollToServices} 
              className={`nav-button ${isServicesActive ? 'active-link' : ''}`}
            >
              Services
            </button>
          </li>
          <li>
            <RouterLink 
              to="/about" 
              className={isLinkActive('/about') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              About
            </RouterLink>
          </li>
          <li>
            <RouterLink 
              to="/contact" 
              className={isLinkActive('/contact') ? 'active-link' : ''}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;