import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaHeart  } from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemsCount } from '../../slice/cartSlice';
import { selectWishlistCount } from '../../slice/wishlistSlice';
import { logout } from '../../slice/authSlice'; // Assuming you have this action
import ConfirmationModal from './ConfirmationModal';
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartItemsCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const userData = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // Check if user is admin
  const isAdmin = userData && (userData.role === 'admin' || userData.isAdmin === true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
    if (location.pathname === "/") {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate("/", { state: { scrollToServices: true } });
    }
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search-results', { state: { query: searchQuery.trim() } });
      setSearchQuery('');
      setIsOpen(false);
    } else {
      alert("Please enter a search term.");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout()); // Dispatch logout action
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const [isServicesActive, setIsServicesActive] = useState(false);
  
  useEffect(() => {
    const checkIfServicesActive = () => {
      if (location.pathname === '/') {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          const rect = servicesSection.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
          setIsServicesActive(isVisible);
        }
      } else {
        setIsServicesActive(false);
      }
    };
    
    window.addEventListener('scroll', checkIfServicesActive);
    checkIfServicesActive();
    
    return () => window.removeEventListener('scroll', checkIfServicesActive);
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="top-section">
          <div className="logo">MIZAN MOBILE</div>
          
          <div className="search-container">
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
          </div>
          
          <div className="right-icons">
            <RouterLink to="/wishlist" className={`wishlist-icon ${isLinkActive('/wishlist') ? 'active-link' : ''}`}>
              <FaHeart />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </RouterLink>
            
            <RouterLink to="/cart" className={`cart-icon ${isLinkActive('/cart') ? 'active-link' : ''}`}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </RouterLink>
            
            {userData ? (
              <>
                <RouterLink to="/profile" className={isLinkActive('/profile') ? 'active-link' : ''}>
                  <FaUser />
                </RouterLink>
                <button 
                  onClick={handleLogoutClick}
                  className="logout-btn"
                  title="Logout"
                >
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
                to="/newphonebooking" 
                className={isLinkActive('/newphonebooking') ? 'active-link' : ''}
                onClick={() => setIsOpen(false)}
              >
                Book Your Phone
              </RouterLink>
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

            {/* Conditionally render Admin Dashboard link only for admin users */}
            {isAuthenticated && isAdmin && (
              <li>
                <RouterLink 
                  to="/admin/dashboard" 
                  className={isLinkActive('/admin/dashboard') ? 'active-link' : ''}
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </RouterLink>
              </li>
            )}
            
            <li className="mobile-only">
              <RouterLink 
                to="/wishlist" 
                className={isLinkActive('/wishlist') ? 'active-link' : ''}
                onClick={() => setIsOpen(false)}
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </RouterLink>
            </li>
            <li className="mobile-only">
              <RouterLink 
                to="/cart" 
                className={isLinkActive('/cart') ? 'active-link' : ''}
                onClick={() => setIsOpen(false)}
              >
                Cart {cartCount > 0 && `(${cartCount})`}
              </RouterLink>
            </li>
            
            {/* {userData && (
              <li className="mobile-only">
                <button 
                  onClick={handleLogoutClick}
                  className="mobile-logout-btn"
                >
                  Logout
                </button>
              </li>
            )} */}
          </ul>
        </div>
      </nav>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
}

export default Navbar;