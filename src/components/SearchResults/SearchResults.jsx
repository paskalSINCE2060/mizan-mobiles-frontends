import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { addToCart } from '../../slice/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../slice/wishlistSlice';
import { fetchProducts, selectProducts, selectProductsLoading } from '../../slice/productsSlice';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  // Add safety check to ensure products is always an array
  const productsFromStore = useSelector(selectProducts);
  const products = useMemo(() => {
    return Array.isArray(productsFromStore) ? productsFromStore : [];
  }, [productsFromStore]);
  
  const loading = useSelector(selectProductsLoading);

  // Initialize search query from navigation state
  useEffect(() => {
    const query = location.state?.query || '';
    setSearchQuery(query);
  }, [location.state]);

  // Fetch products when component mounts
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Filter products based on search query only
  const filteredProducts = useMemo(() => {
    // Additional safety check
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    let filtered = products.filter(product => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    });


    return filtered;
  }, [searchQuery, products]);

  // const handleNewSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     // Update the current search without navigating
  //     const newQuery = searchQuery.trim();
  //     setSearchQuery(newQuery);
  //   }
  // };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleProductClick = (product) => {
    navigate('/productdetails', { state: { product } });
  };

  const getDiscountPercentage = (original, discounted) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const getSafeImageUrl = (product) => {
    if (product.image) {
      // If it's already a full URL, return as is
      if (product.image.startsWith('http')) {
        return product.image;
      }
      // If it's a relative path, prepend your API base URL
      return `${process.env.REACT_APP_API_URL || ''}/uploads/${product.image}`;
    }
    return '/api/placeholder/300/300';
  };

  const getProductPrice = (product) => {
    return product.discountedPrice || product.price || 0;
  };

  const getOriginalPrice = (product) => {
    return product.originalPrice || product.price || 0;
  };

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      {/* Header Section */}
      {/* <div className="search-results-header">
        <div className="search-header-content">
          <form onSubmit={handleNewSearch} className="search-form-results">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="search-input-results"
              />
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </div>
          </form>
        </div>
      </div> */}

      {/* Results Info and Controls */}
      <div className="results-controls">
        <div className="results-info">
          <p className="results-count">
            {filteredProducts.length} results found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>


      </div>

      <div className="search-results-content">
        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <FaSearch />
              </div>
              <h3>Sorry, no products found</h3>
              <p>
                {searchQuery 
                  ? `No products match your search for "${searchQuery}"`
                  : "No products available"
                }
              </p>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={getSafeImageUrl(product)} 
                    alt={product.name || 'Product'}
                    className="product-image"
                    onClick={() => handleProductClick(product)}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/300';
                    }}
                  />
                  {getDiscountPercentage(getOriginalPrice(product), getProductPrice(product)) > 0 && (
                    <span className="discount-badge">
                      -{getDiscountPercentage(getOriginalPrice(product), getProductPrice(product))}%
                    </span>
                  )}
                  <button 
                    className={`wishlist-btn ${wishlistItems.some(item => item.id === product.id) ? 'active' : ''}`}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <FaHeart />
                  </button>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name" onClick={() => handleProductClick(product)}>
                    {product.name || 'Unnamed Product'}
                  </h3>
                  
                  {/* <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                    <span className="rating-text">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div> */}
                  
                  <div className="product-price">
                    <span className="discounted-price">
                      NPR {getProductPrice(product).toLocaleString()}
                    </span>
                    {getDiscountPercentage(getOriginalPrice(product), getProductPrice(product)) > 0 && (
                      <span className="original-price">
                        NPR {getOriginalPrice(product).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;