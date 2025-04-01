import React from "react";
import { useNavigate } from "react-router-dom";
import './Homepage.css';
import { useCart } from "../../context/cartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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
import sale from '../../assets/sale.png'

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
        <div className="white">
 <ToastContainer position="top-right" autoClose={3000} hideProgressBar />            
            <section className="hero">
                <div className="hero-content">
                   < a href="/categories">
                    <button>
                    Shop Now
                    </button>
                    </a>
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
                                    toast.success("Added to Cart!", {
                                        position: "top-right",
                                        autoClose: 2000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "light",
                                    });
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="why-us-container">
                <div className="why-us-content">
                    <h2>Why us?</h2>
                    <p>
                    The products we sell are professionally inspected and thoroughly tested using a full diagnostic testing software. Our skilled professionals make sure that the products that reach your doorsteps are always in a pristine condition.
                    </p>
                </div>
                <div className="why-us-features">
                    <div className="why-us-feature">
                    <div className="why-us-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div className="why-us-feature-content">
                        <h3>Product you can trust</h3>
                        <p>You'll always have a tested and certified latest piece of tech and a Happy Wallet all the time.</p>
                    </div>
                    </div>
                    <div className="why-us-feature">
                    <div className="why-us-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="why-us-feature-content">
                        <h3>Quality you can rely on</h3>
                        <p>Our working professionals make sure that the utmost quality products are always in a top-notch condition.</p>
                    </div>
                    </div>
                </div>
            </div>


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
                                    toast.success("Added to Cart!", {
                                        position: "top-right",
                                        autoClose: 2000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "light",
                                    });
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


            <div className="sell-your-smartphone-container">
                <div className="sell-your-smartphone-wrapper">
                    <div className="sell-your-smartphone-content">
                        <h1 className="sell-your-smartphone-title">Wanna Sell Your Smartphone?</h1>
                        <p className="sell-your-smartphone-description">
                            Get Instant Valuation in just a minute. Just enter your device's true condition and get a price quote. 
                            Get Door-step Pickup with Same Day Payment Guaranteed.
                        </p>
                        <a href="/sellyourphone">
                        <button className="sell-your-smartphone-cta">Sell Now</button>
                        </a>
                    </div>
                    <div className="sell-your-smartphone-devices">
                        <img src={sale} alt="" />
                    </div>
                </div>
             </div>



             <div class="marketplace-container">
                <h1 class="marketplace-title">Buy + Sell + Save</h1>
                
                <div class="product-categories">
                    <a href="/smartphone"
                    class="category">
                    <div class="category">
                           <h2>Phones + iPhones</h2>
                          <div class="product-image">
                            <img src={sellPhone} alt="Phone Collection"/>
                          </div>
                         <div class="category-stats">
                         <span class="listings">15996 approved listings</span>
                        <span class="sellers">1398 legit sellers</span>
                        </div>
                     </div>                        
                    </a>
                    
                    <a href="/tablets"
                    className="category">
                    <div class="category">
                        <h2>MacBooks + Laptops</h2>
                        <div class="product-image">
                            <img src={buylaptops} alt="Laptop Collection"/>
                        </div>
                        <div class="category-stats">
                            <span class="listings">1022 approved listings</span>
                            <span class="sellers">450 legit sellers</span>
                        </div>
                    </div>
                    </a>
                    
                    <a href="/watches"
                    className="category">
                    <div class="category">
                        <h2>Watches</h2>
                        <div class="product-image">
                            <img src={galaxybuds3} alt="Watch Collection" />
                        </div>
                        <div class="category-stats">
                            <span class="listings">1017 approved listings</span>
                            <span class="sellers">271 legit sellers</span>
                        </div>
                    </div>
                    </a>
                </div>
            </div>



        </div>
    );
}

export default HomePage;