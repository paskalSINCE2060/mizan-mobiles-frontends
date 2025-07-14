import React from 'react';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useWishlist } from '../../hooks/useWishlist'; // Use the existing hook
import { addToCart } from '../../slice/cartSlice'; // Import cart action
import { toast } from 'react-toastify';
import './wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use the existing wishlist hook that connects to Redux
  const { wishlistItems, removeItem } = useWishlist();

  // Remove item from wishlist using Redux
  const removeFromWishlist = (productId) => {
    removeItem(productId);
    toast.info("Removed from Wishlist!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Add to cart function using Redux
  const addToCartHandler = (product) => {
    dispatch(addToCart({
      ...product,
      price: product.discountedPrice || product.price,
      image: product.image
    }));
    
    toast.success("Added to Cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
    
    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  const handleProductClick = (product) => {
    navigate('/productdetails', { state: { product } });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="empty-wishlist">
            <FaHeart size={80} color="#ddd" />
            <h2>Your wishlist is empty</h2>
            <p>Add some products to your wishlist to see them here.</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
        </div>
        
        <div className="wishlist-table">
          <div className="wishlist-table-header">
            <span></span>
            <span>Product name</span>
            <span>Unit price</span>
            <span>Actions</span>
          </div>
          
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item-image" onClick={() => handleProductClick(item)}>
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-name" onClick={() => handleProductClick(item)}>
                  {item.name}
                </h3>
              </div>
              
              <div className="wishlist-item-price">
                <span className="current-price">
                  NPR {item.discountedPrice?.toLocaleString() || item.price?.toLocaleString()}
                </span>
                {item.originalPrice && item.originalPrice !== item.discountedPrice && (
                  <span className="original-price">NPR {item.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              <div className="wishlist-item-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCartHandler(item)}
                >
                  <FaShoppingCart />
                  Add to cart
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;