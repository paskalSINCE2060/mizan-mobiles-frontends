import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; 
import { addToCart as addToCartAction } from '../../slice/cartSlice'; 
import { useWishlist } from '../../hooks/useWishlist';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"; 
import axios from 'axios';
import './PremiumSmartphonesSection.css'; // Import your CSS file for styles

function PremiumSmartphonesSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // State management
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    
    // Wishlist functionality
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    // State for wishlist click effect and animations
    const [clickedWishlistId, setClickedWishlistId] = useState(null);
    const [wishlistAnimations, setWishlistAnimations] = useState({});

    // Base URL for API
    const BASE_URL = 'http://localhost:5000';

    // Fetch Premium Smartphones from API
    useEffect(() => {
        fetchPremiumSmartphones();
    }, []);

    const fetchPremiumSmartphones = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // ✅ FIXED: Fetch products specifically from 'premiumsmartphones' category
            const response = await axios.get(`${BASE_URL}/api/products/category/premiumsmartphones?sort=createdAt_desc`);
            
            console.log('API Response:', response.data); // Debug log
            
            if (response.data.success) {
                // Map the products to the expected format
                const premiumProducts = response.data.data.map(product => ({
                    id: product._id,
                    image: product.image,
                    name: product.name,
                    originalPrice: product.oldPrice || product.price * 1.2, // fallback if no oldPrice
                    discountedPrice: product.price,
                    description: product.description,
                    specs: product.specs || {
                        storage: 'Not specified',
                        display: 'Not specified',
                        battery: 'Not specified',
                        camera: 'Not specified'
                    },
                    brand: product.brand,
                    inStock: product.inStock,
                    featured: product.featured,
                    category: product.category
                }));
                
                console.log('Mapped Premium Products:', premiumProducts); // Debug log
                setProducts(premiumProducts);
            } else {
                setError('Failed to fetch premium smartphones');
            }
        } catch (err) {
            console.error('Error fetching premium smartphones:', err);
            setError('Failed to load premium smartphones. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Get products to display (4 recent or all)
    const getDisplayProducts = () => {
        if (showAll) {
            return products;
        }
        return products.slice(0, 4); // Show only first 4 products
    };

    // Handle product click to navigate to product details
    const handleProductClick = (product) => {
        navigate('/productdetails', { state: { product } });
    };

    // Function to handle adding items to cart using Redux
    const handleAddToCart = (product) => {
        dispatch(addToCartAction({
            _id: product.id,  // ✅ Convert id back to _id for the Redux action
            name: product.name,
            price: product.discountedPrice,
            image: product.image,
            quantity: 1,
            // Add other fields if needed
            specialOffer: null,
            originalPrice: product.originalPrice,
            promoCode: null
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
    };

    // Enhanced function to handle wishlist toggle with animations
    const handleWishlistToggle = (product, e) => {
        e.stopPropagation(); // Prevent product click navigation
        
        // Set clicked effect
        setClickedWishlistId(product.id);
        
        // Add animation class
        setWishlistAnimations(prev => ({
            ...prev,
            [product.id]: 'animate'
        }));
        
        // Remove clicked effect and animation after duration
        setTimeout(() => {
            setClickedWishlistId(null);
            setWishlistAnimations(prev => ({
                ...prev,
                [product.id]: ''
            }));
        }, 600);
        
        toggleWishlist(product);
    };

    // Wishlist component for rendering wishlist button
    const WishlistButton = ({ product, className = "" }) => {
        const isWishlisted = isInWishlist(product.id);
        const isClicked = clickedWishlistId === product.id;
        const animationClass = wishlistAnimations[product.id] || '';
        
        return (
            <button 
                className={`premium-wishlist-btn ${isWishlisted ? 'active' : ''} ${isClicked ? 'clicked' : ''} ${animationClass} ${className}`}
                onClick={(e) => handleWishlistToggle(product, e)}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                <span className="premium-wishlist-ripple"></span>
            </button>
        );
    };

    // Handle View All / View Less toggle
    const handleViewToggle = () => {
        setShowAll(!showAll);
    };

    // Handle refresh/retry
    const handleRefresh = () => {
        fetchPremiumSmartphones();
    };

    // Loading component
    if (loading) {
        return (
            <section className="premium-smartphones-container">
                <h2 className="premium-smartphones-title">Premium PreLoved Smartphones</h2>
                <div className="premium-loading-container">
                    <p>Loading premium smartphones...</p>
                    <div className="premium-spinner-container">
                        <div className="premium-spinner"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Error component
    if (error) {
        return (
            <section className="premium-smartphones-container">
                <h2 className="premium-smartphones-title">Premium PreLoved Smartphones</h2>
                <div className="premium-error-container">
                    <p className="premium-error-message">{error}</p>
                    <button 
                        onClick={handleRefresh}
                        className="premium-retry-btn"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    // No products found
    if (products.length === 0) {
        return (
            <section className="premium-smartphones-container">
                <h2 className="premium-smartphones-title">Premium PreLoved Smartphones</h2>
                <div className="premium-no-products-container">
                    <p>No premium smartphones available at the moment.</p>
                    <p>Please check back later!</p>
                    <button 
                        onClick={handleRefresh}
                        className="premium-refresh-btn"
                    >
                        Refresh
                    </button>
                </div>
            </section>
        );
    }

    const displayProducts = getDisplayProducts();

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            
            <section className="premium-smartphones-container">
                <div className="premium-section-header">
                    <h2 className="premium-smartphones-title">Premium PreLoved Smartphones</h2>
                    {products.length > 4 && (
                        <button 
                            className="premium-view-all-btn"
                            onClick={handleViewToggle}
                        >
                            {showAll ? 'View Less' : `View All (${products.length})`}
                        </button>
                    )}
                </div>
                
                <div className="premium-smartphones-grid">
                    {displayProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="premium-smartphone-card"
                            onClick={() => handleProductClick(product)}
                        >
                            <div className="premium-product-image-container">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="premium-product-image"
                                    onError={(e) => {
                                        e.target.src = '/path/to/default-phone-image.jpg'; // Add a default image
                                        e.target.alt = 'Product image not available';
                                    }}
                                />
                                <WishlistButton product={product} className="premium-wishlist-button" />
                                {!product.inStock && (
                                    <div className="premium-out-of-stock-overlay">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            <h3 className="premium-product-name">{product.name}</h3>
                            {product.brand && (
                                <p className="premium-product-brand">
                                    {product.brand}
                                </p>
                            )}
                            <p className="premium-product-price">
                                {product.originalPrice > product.discountedPrice && (
                                    <del className="premium-original-price">
                                        NPR {product.originalPrice.toLocaleString()}
                                    </del>
                                )}
                                <span className="premium-discounted-price">
                                    NPR {product.discountedPrice.toLocaleString()}
                                </span>
                            </p>
                            <button 
                                className={`premium-add-to-cart-btn ${!product.inStock ? 'premium-disabled' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (product.inStock) {
                                        handleAddToCart(product);
                                    } else {
                                        toast.error("Product is out of stock!", {
                                            position: "top-right",
                                            autoClose: 2000,
                                        });
                                    }
                                }}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    ))}
                </div>
                
                {showAll && products.length > 4 && (
                    <div className="premium-show-less-container">
                        <button 
                            className="premium-show-less-btn"
                            onClick={handleViewToggle}
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

export default PremiumSmartphonesSection;