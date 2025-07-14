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
import './GalaxyProductsSection.css'; // Import your CSS file for styles


function GalaxyProductsSection() {
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

    // Fetch Galaxy Products from API
    useEffect(() => {
        fetchGalaxyProducts();
    }, []);

    const fetchGalaxyProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // ✅ NEW: Fetch products specifically from 'galaxyproducts' category
            const response = await axios.get(`${BASE_URL}/api/products/category/galaxyproducts?sort=createdAt_desc`);
            
            console.log('Galaxy Products API Response:', response.data); // Debug log
            
            if (response.data.success) {
                // Map the products to the expected format
                const galaxyProducts = response.data.data.map(product => ({
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
                        camera: 'Not specified',
                        connectivity: 'Not specified',
                        features: 'Not specified',
                        sensors: 'Not specified',
                        color: 'Not specified'
                    },
                    brand: product.brand,
                    inStock: product.inStock,
                    featured: product.featured,
                    category: product.category,
                    // Additional fields for compatibility
                    color: product.specs?.color || 'Not specified'
                }));
                
                console.log('Mapped Galaxy Products:', galaxyProducts); // Debug log
                setProducts(galaxyProducts);
            } else {
                setError('Failed to fetch Galaxy products');
            }
        } catch (err) {
            console.error('Error fetching Galaxy products:', err);
            setError('Failed to load Galaxy products. Please try again later.');
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
    console.log('Adding Galaxy product to cart:', product); // Debug log
    
    dispatch(addToCartAction({
        _id: product.id,  // ✅ Convert id to _id for Redux action
        name: product.name,
        price: product.discountedPrice,
        image: product.image,
        quantity: 1,
        specialOffer: null,
        originalPrice: product.originalPrice,
        promoCode: null,
        // Add any other fields your cart needs
        brand: product.brand,
        color: product.color,
        category: product.category
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
                className={`wishlist-btn ${isWishlisted ? 'active' : ''} ${isClicked ? 'clicked' : ''} ${animationClass} ${className}`}
                onClick={(e) => handleWishlistToggle(product, e)}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                <span className="wishlist-ripple"></span>
            </button>
        );
    };

    // Handle View All / View Less toggle
    const handleViewToggle = () => {
        setShowAll(!showAll);
    };

    // Handle refresh/retry
    const handleRefresh = () => {
        fetchGalaxyProducts();
    };

    // Loading component
    if (loading) {
        return (
            <section className="different-equipment container">
                <h2 className="different-equipment">Multi Buy Offer</h2>
                <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Laptops, Buds and more</p>
                <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading Galaxy products...</p>
                    <div style={{ marginTop: '1rem' }}>
                        <div className="spinner" style={{
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            animation: 'spin 2s linear infinite',
                            margin: '0 auto'
                        }}></div>
                    </div>
                </div>
            </section>
        );
    }

    // Error component
    if (error) {
        return (
            <section className="different-equipment container">
                <h2 className="different-equipment">Multi Buy Offer</h2>
                <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Laptops, Buds and more</p>
                <div className="error-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
                    <button 
                        onClick={handleRefresh}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            marginTop: '1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
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
            <section className="different-equipment container">
                <h2 className="different-equipment">Multi Buy Offer</h2>
                <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Laptops, Buds and more</p>
                <div className="no-products-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No Galaxy products available at the moment.</p>
                    <p>Please check back later!</p>
                    <button 
                        onClick={handleRefresh}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            marginTop: '1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
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
            
            <section className="different-equipment container">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2 className="different-equipment">Multi Buy Offer</h2>
                        <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Laptops, Buds and more</p>
                    </div>
                    {products.length > 4 && (
                        <button 
                            className="view-all-btn"
                            onClick={handleViewToggle}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#007bff';
                                e.target.style.borderColor = '#007bff';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = 'white';
                            }}
                        >
                            {showAll ? 'View Less' : `View All (${products.length})`}
                        </button>
                    )}
                </div>
                
                <div className="different-equipment product-grid">
                    {displayProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="different-equipment product"
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Wishlist button now positioned relative to the product card */}
                            <WishlistButton product={product} className="wishlist-button-card" />
                            
                            <div className="product-image-container">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="different-equipment"
                                    onError={(e) => {
                                        e.target.src = '/path/to/default-galaxy-image.jpg'; // Add a default image
                                        e.target.alt = 'Product image not available';
                                    }}
                                />
                                {!product.inStock && (
                                    <div className="out-of-stock-overlay" style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            <h3 className="different-equipment">{product.name}</h3>
                            {product.brand && (
                                <p className="product-brand" style={{ fontSize: '0.9rem', color: '#666', margin: '0.25rem 0' }}>
                                    {product.brand}
                                </p>
                            )}
                            <p className="different-equipment color">
                                <strong>Color:</strong> {product.color}
                            </p>
                            <div className="different-equipment color-options">
                                <span className="different-equipment color-circle blue selected"></span>
                                <span className="different-equipment color-circle gray"></span>
                            </div>
                            <p className="different-equipment price">
                                NPR {product.discountedPrice.toLocaleString()}
                            </p>
                            {/* <p className="different-equipment discount">
                                {product.originalPrice > product.discountedPrice && (
                                    <>
                                        <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                        <span className="different-equipment save">
                                            Save NPR {(product.originalPrice - product.discountedPrice).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </p> */}
                            <button 
                                className="different-equipment add-button"
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
                                style={{
                                    opacity: product.inStock ? 1 : 0.6,
                                    cursor: product.inStock ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    ))}
                </div>
                
                {showAll && products.length > 4 && (
                    <div className="show-less-container" style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button 
                            className="show-less-btn"
                            onClick={handleViewToggle}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

export default GalaxyProductsSection;