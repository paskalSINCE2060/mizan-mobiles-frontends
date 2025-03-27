import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import './Homepage.css';

// Import all necessary images
import iphone11promax from '../../assets/iphone11promax.jpeg'
import iphone13pro from '../../assets/iphone13pro.jpg'
import iphone13promax from '../../assets/iphone13promax.png'
import iphone14 from '../../assets/iphone14.jpg'
import galaxybuds3 from '../../assets/GalaxyBuds3.jpeg'
import galaxybuds3pro from '../../assets/GalaxyBuds3Pro.jpeg'
import galaxywatch7 from '../../assets/GalaxyWatch7.jpeg'
import galaxywatchultra from '../../assets/GalaxyWatchUltra.jpeg'
import hero_image from '../../assets/banner.png'
import buylaptops from '../../assets/BuyLaptops.webp'
import buyPhone from '../../assets/buyPhone.webp'
import buySmartWatches from '../../assets/BuySmartWatches.webp'
import findnewphone from '../../assets/FindNewPhone.webp'
import nearbystore from '../../assets/NearbyStores.webp'
import recycle from '../../assets/Recycle.webp'
import repairphone from '../../assets/RepairPhone.webp'
import repairLaptop from '../../assets/RepairLaptop.webp'
import sellPhone from '../../assets/sellPhone.webp'

function HomePage() {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Comprehensive product data with detailed information
    const products = [
        {
            id: 'iphone14-256gb',
            image: iphone14,
            name: 'Apple iPhone 14 Pro Max [256GB]',
            originalPrice: 192000.00,
            discountedPrice: 111500.00,
            description: 'The latest iPhone with advanced camera system and powerful A16 Bionic chip.',
            specs: {
                storage: '256GB',
                display: '6.7-inch Super Retina XDR OLED',
                battery: 'Up to 29 hours video playback',
                camera: 'Triple 48MP camera system'
            }
        },
        {
            id: 'iphone13pro-256gb',
            image: iphone13pro,
            name: 'Apple iPhone 13 Pro Max [256GB]',
            originalPrice: 131900.00,
            discountedPrice: 91500.00,
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
            image: iphone13promax,
            name: 'Apple iPhone 13 Pro Max [128GB]',
            originalPrice: 131900.00,
            discountedPrice: 85500.00,
            description: 'High-performance smartphone with excellent camera capabilities.',
            specs: {
                storage: '128GB',
                display: '6.7-inch Super Retina XDR OLED',
                battery: 'Up to 26 hours video playback',
                camera: 'Triple 12MP camera system'
            }
        },
        {
            id: 'iphone11promax-512gb',
            image: iphone11promax,
            name: 'Apple iPhone 11 Pro Max [512GB]',
            originalPrice: 186000.00,
            discountedPrice: 53500.00,
            description: 'Reliable smartphone with great performance and camera.',
            specs: {
                storage: '512GB',
                display: '6.5-inch Super Retina XDR OLED',
                battery: 'Up to 24 hours video playback',
                camera: 'Triple 12MP camera system'
            }
        }
    ];

    const galaxyProducts = [
        {
            id: 'galaxy-watch-ultra',
            image: galaxywatchultra,
            name: 'Galaxy Watch Ultra (LTE, 47mm)',
            originalPrice: 988.00,
            discountedPrice: 691.60,
            color: 'Titanium Silver',
            description: 'Advanced smartwatch with comprehensive health tracking.',
            specs: {
                display: '1.4-inch Super AMOLED',
                connectivity: 'LTE, Bluetooth, WiFi',
                battery: 'Up to 2 days',
                sensors: 'Heart Rate, ECG, GPS'
            }
        },
        {
            id: 'galaxy-buds-3-pro',
            image: galaxybuds3pro,
            name: 'Galaxy Buds3 Pro',
            originalPrice: 358.00,
            discountedPrice: 250.60,
            color: 'Silver',
            description: 'Premium wireless earbuds with noise cancellation.',
            specs: {
                connectivity: 'Bluetooth 5.3',
                battery: 'Up to 18 hours with charging case',
                features: 'Active Noise Cancellation, IPX7 Water Resistance'
            }
        },
        {
            id: 'galaxy-buds-3',
            image: galaxybuds3,
            name: 'Galaxy Buds3',
            originalPrice: 258.00,
            discountedPrice: 180.60,
            color: 'White',
            description: 'Compact wireless earbuds with great sound quality.',
            specs: {
                connectivity: 'Bluetooth 5.2',
                battery: 'Up to 15 hours with charging case',
                features: 'Ambient Sound Mode, Touch Controls'
            }
        },
        {
            id: 'galaxy-watch-7',
            image: galaxywatch7,
            name: 'Galaxy Watch7 (Bluetooth, 44mm)',
            originalPrice: 498.00,
            discountedPrice: 348.60,
            color: 'Green',
            description: 'Versatile smartwatch with fitness tracking features.',
            specs: {
                display: '1.2-inch Super AMOLED',
                connectivity: 'Bluetooth',
                battery: 'Up to 40 hours',
                sensors: 'Heart Rate, GPS, Accelerometer'
            }
        }
    ];

    // Handle product click to navigate to product details
    const handleProductClick = (product) => {
        navigate('/productdetails', { state: { product } });
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <button>Shop Now</button>
                </div>
            </section>

            {/* iPhone Products Section */}
            <section className="carts-item container">
                <h2 className="carts-item">Premium PreLoved Smartphones</h2>
                <div className="carts-item product-grid">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="carts-item product"
                            onClick={() => handleProductClick(product)}
                        >
                            <img src={product.image} alt={product.name} className="carts-item"/>
                            <h3 className="carts-item">{product.name}</h3>
                            <p className="carts-item price">
                                <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                NPR {product.discountedPrice.toLocaleString()}
                            </p>
                            <button 
                                className="carts-item" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                        ...product,
                                        price: product.discountedPrice,
                                        image: product.image
                                    })
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Galaxy Products Section */}
            <section className="different-equipment container">
                <h2 className="different-equipment">Multi Buy Offer</h2>
                <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Tablets, Buds and more</p>
                <div className="different-equipment product-grid">
                    {galaxyProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="different-equipment product"
                            onClick={() => handleProductClick(product)}
                        >
                            <img src={product.image} alt={product.name} className="different-equipment"/>
                            <h3 className="different-equipment">{product.name}</h3>
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
                            <p className="different-equipment discount">
                                <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                <span className="different-equipment save">
                                    Save NPR {(product.originalPrice - product.discountedPrice).toLocaleString()}
                                </span>
                            </p>
                            <button 
                                className="different-equipment add-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                        ...product,
                                        price: product.discountedPrice,
                                        image: product.image
                                    })
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Valentine's Day Banner */}
            <header className="banner-content-header">
                <div className="banner-content-banner">
                    <img src={hero_image} alt="Valentine's Day Sale Banner"/>
                </div>
            </header>

            {/* Services Section */}
            <section className="banner-content-services" id="services">
                <h2>Our Services</h2>
                <div className="banner-content-services-container">
                    {[
                        { img: sellPhone, text: 'Sell Phone' },
                        { img: buyPhone, text: 'Buy Phone' },
                        { img: buylaptops, text: 'Buy Laptops' },
                        { img: repairphone, text: 'Repair Phone' },
                        { img: repairLaptop, text: 'Repair Laptop' },
                        { img: findnewphone, text: 'Find New Phone' },
                        { img: nearbystore, text: 'Nearby Stores' },
                        { img: buySmartWatches, text: 'Buy Smartwatches' },
                        { img: recycle, text: 'Recycle' }
                    ].map((service, index) => (
                        <div key={index} className="banner-content-service">
                            <img src={service.img} alt={service.text}/>
                            <p>{service.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HomePage;