import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCart } from '../../context/cartContext';
import "./Navbar.css";

function Navbar({ userData, setUserData }) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [searchRecommendations, setSearchRecommendations] = useState([]);
   const { cartCount } = useCart();
   const navigate = useNavigate();

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

   const toggleMenu = () => {
     setIsOpen(!isOpen);
   };

   const handleSearchChange = (e) => {
     setSearchQuery(e.target.value);
   };

   const handleSearchSubmit = (e) => {
     e.preventDefault();
     if (searchRecommendations.length > 0) {
       navigate('/search', { state: { query: searchQuery } });
     } else {
       alert("No products found matching your search.");
     }
   };

   const handleSearchRecommendationClick = (product) => {
     navigate('/productdetails', { state: { product } }); // Passing full product details
     setSearchRecommendations([]);  // Clear recommendations after selection
     setSearchQuery('');  // Reset the search query
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

       <ul className={`nav-links ${isOpen ? "active" : ""}`}>
         <li><RouterLink to="/">Home</RouterLink></li>
         <li><RouterLink to="/categories">Categories</RouterLink></li>
         <li><RouterLink to="/about">About</RouterLink></li>
         <li><RouterLink to="/contact">Contact</RouterLink></li>
         <li><button onClick={() => navigate("/")} className="nav-button">Services</button></li>
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
