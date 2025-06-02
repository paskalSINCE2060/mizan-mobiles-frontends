import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slice/cartSlice"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import "./ProductDetails.css";

// Import related products images
import iphone13pro from '../../assets/iphone13pro.jpg';
import iphone13promax from '../../assets/iphone13promax.png';

const ProductDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("description");

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.state]);

    // Get product from navigation state, or use a default product
    const product = location.state?.product || {
        name: "Product Not Found",
        discountedPrice: 0,
        originalPrice: 0,
        image: "https://via.placeholder.com/400x400",
        description: "No description available.",
        specs: {}
    };

    // Ensure price and image are always defined
    const productImage = product.image || "https://via.placeholder.com/400x400";
    const productDiscountedPrice = product.discountedPrice ?? 0;
    const productOriginalPrice = product.originalPrice ?? 0;

    // Check if the product has special offer
    const hasSpecialOffer = !!product.specialOffer;

    // Format date for special offer validity
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Related products based on the current product category
    const relatedProducts = [
        { 
            id: 'iphone13pro-256gb', 
            name: "Apple iPhone 13 Pro", 
            originalPrice: 131900.00, 
            discountedPrice: 91500.00, 
            image: iphone13pro,
            description: 'Powerful smartphone with pro-level camera and A15 Bionic chip.',
            specs: {
                storage: '256GB',
                display: '6.7-inch Super Retina XDR OLED',
                battery: 'Up to 28 hours video playback',
                camera: 'Triple 12MP camera system'
            }
        },
        { 
            id: 'iphone13promax-128gb', 
            name: "Apple iPhone 13 Pro Max", 
            originalPrice: 131900.00, 
            discountedPrice: 85500.00, 
            image: iphone13promax,
            description: 'High-performance smartphone with excellent camera capabilities.',
            specs: {
                storage: '128GB',
                display: '6.7-inch Super Retina XDR OLED',
                battery: 'Up to 26 hours video playback',
                camera: 'Triple 12MP camera system'
            }
        }
    ];

    // Handle related product click
    const handleRelatedProductClick = (relatedProduct) => {
        if (!relatedProduct) return;
        navigate('/productdetails', { state: { product: relatedProduct } });
    };

    // Function to copy promo code to clipboard
    const copyPromoCode = (code) => {
        if (!code) return;
        
        navigator.clipboard.writeText(code)
            .then(() => {
                toast.info('Promo code copied to clipboard!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy promo code', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            });
    };

    // Handle add to cart with toast notification
    const handleAddToCart = (item) => {
        // Ensure the item has required properties for the cart
        const cartItem = {
            id: item.id || `${item.name}-${Date.now()}`, // Generate ID if not present
            name: item.name,
            price: item.discountedPrice || item.price || 0,
            image: item.image,
            originalPrice: item.originalPrice,
            discountedPrice: item.discountedPrice,
            description: item.description,
            specs: item.specs,
            quantity: 1 // Default quantity
        };

        dispatch(addToCart(cartItem));
        
        toast.success(`${item.name} added to cart!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    };

    return (
        <div className="Product-details-container">
            {/* Toast Container */}
            <ToastContainer />
            
            {/* Main Product Details */}
            {product && product.name ? (
                <div className="Product-details-main">
                    <div className="Product-details-image-container" style={{ width: '50%', minWidth: '300px' }}>
                        <img 
                            src={productImage} 
                            alt={product.name} 
                            className="Product-details-image" 
                            style={{
                                width: '100%', 
                                height: '500px', 
                                objectFit: 'contain', 
                                objectPosition: 'center'
                            }}
                        />
                    </div>
                    <div className="Product-details-info">
                        <h2 className="Product-details-name">{product.name}</h2>

                        {/* Special Offer Banner */}
                        {hasSpecialOffer && (
                            <div className="Product-details-special-offer">
                                <div className="special-offer-badge">
                                    {product.specialOffer.discount}
                                </div>
                                <div className="special-offer-info">
                                    <h3>{product.specialOffer.title}</h3>
                                    <p>{product.specialOffer.description}</p>
                                    {product.specialOffer.validUntil && (
                                        <p className="special-offer-validity">
                                            Valid until: {formatDate(product.specialOffer.validUntil)}
                                        </p>
                                    )}
                                    {product.specialOffer.promoCode && (
                                        <div className="special-offer-promo">
                                            <span>Promo Code: <b>{product.specialOffer.promoCode}</b></span>
                                            <button 
                                                className="copy-promo-button"
                                                onClick={() => copyPromoCode(product.specialOffer.promoCode)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <p className="Product-details-price">
                            NPR {productDiscountedPrice.toLocaleString()} 
                            <span className="Product-details-original-price">
                                NPR {productOriginalPrice.toLocaleString()}
                            </span>
                        </p>
                        <button 
                            className="Product-details-add-to-cart"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}

            {/* Product Tabs */}
            <div className="Product-details-tabs">
                <button 
                    onClick={() => setActiveTab("description")} 
                    className={`Product-details-tab ${activeTab === "description" ? "Product-details-active-tab" : ""}`}
                >
                    Description
                </button>
                <button 
                    onClick={() => setActiveTab("specs")} 
                    className={`Product-details-tab ${activeTab === "specs" ? "Product-details-active-tab" : ""}`}
                >
                    Specifications
                </button>
                {hasSpecialOffer && (
                    <button 
                        onClick={() => setActiveTab("offer")} 
                        className={`Product-details-tab ${activeTab === "offer" ? "Product-details-active-tab" : ""}`}
                    >
                        Special Offer
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="Product-details-tab-content">
                {activeTab === "description" ? (
                    <p>{product.description}</p>
                ) : activeTab === "specs" ? (
                    <div className="Product-details-specs">
                        <h3 className="Product-details-specs-header">Specifications</h3>
                        {Object.entries(product.specs || {}).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}:</strong>
                                <span>{value}</span>
                            </p>
                        ))}
                    </div>
                ) : (
                    hasSpecialOffer && (
                        <div className="Product-details-offer-details">
                            <h3>Special Offer Details</h3>
                            <div className="offer-details-content">
                                <p><strong>Offer:</strong> {product.specialOffer.title}</p>
                                <p><strong>Description:</strong> {product.specialOffer.description}</p>
                                {product.specialOffer.validUntil && (
                                    <p><strong>Valid Until:</strong> {formatDate(product.specialOffer.validUntil)}</p>
                                )}
                                {product.specialOffer.promoCode && (
                                    <div className="promo-code-container">
                                        <p><strong>Promo Code:</strong></p>
                                        <div className="promo-code-box">
                                            <span>{product.specialOffer.promoCode}</span>
                                            <button onClick={() => copyPromoCode(product.specialOffer.promoCode)}>
                                                Copy Code
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Related Products */}
            <h3 className="Product-details-related-title">Related Products</h3>
            <div className="Product-details-related-products">
                {relatedProducts.map((item) => (
                    <div 
                        key={item.id} 
                        className="Product-details-related-item"
                        onClick={() => handleRelatedProductClick(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="Product-details-related-image" 
                        />
                        <h4 className="Product-details-related-name">{item.name}</h4>
                        <p className="Product-details-related-price">
                            NPR {item.discountedPrice ? item.discountedPrice.toLocaleString() : "N/A"} 
                            <span className="Product-details-original-price">
                                NPR {item.originalPrice ? item.originalPrice.toLocaleString() : "N/A"}
                            </span>
                        </p>
                        <button 
                            className="Product-details-add-to-cart"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;