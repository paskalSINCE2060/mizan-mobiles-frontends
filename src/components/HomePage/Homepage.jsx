import React from "react";
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
import { useCart } from "../../context/cartContext";
import './Homepage.css';



function HomePage() {
    const { addToCart } = useCart();


    const products = [
        {
          id: 'iphone14-256gb',
          image: iphone14,
          name: 'Apple iPhone 14 Pro Max [256GB]',
          originalPrice: 192000.00,
          discountedPrice: 111500.00
        },
        {
          id: 'iphone13pro-256gb',
          image: iphone13pro,
          name: 'Apple iPhone 13 Pro Max [256GB]',
          originalPrice: 131900.00,
          discountedPrice: 91500.00
        },
        {
          id: 'iphone13promax-128gb',
          image: iphone13promax,
          name: 'Apple iPhone 13 Pro Max [128GB]',
          originalPrice: 131900.00,
          discountedPrice: 85500.00
        },
        {
          id: 'iphone11promax-512gb',
          image: iphone11promax,
          name: 'Apple iPhone 11 Pro Max [512GB]',
          originalPrice: 186000.00,
          discountedPrice: 53500.00
        }
      ];

      const galaxyProducts = [
        {
          id: 'galaxy-watch-ultra',
          image: galaxywatchultra,
          name: 'Galaxy Watch Ultra (LTE, 47mm)',
          originalPrice: 988.00,
          discountedPrice: 691.60,
          color: 'Titanium Silver'
        },
        {
          id: 'galaxy-buds-3-pro',
          image: galaxybuds3pro,
          name: 'Galaxy Buds3 Pro',
          originalPrice: 358.00,
          discountedPrice: 250.60,
          color: 'Silver'
        },
        {
          id: 'galaxy-buds-3',
          image: galaxybuds3,
          name: 'Galaxy Buds3',
          originalPrice: 258.00,
          discountedPrice: 180.60,
          color: 'White'
        },
        {
          id: 'galaxy-watch-7',
          image: galaxywatch7,
          name: 'Galaxy Watch7 (Bluetooth, 44mm)',
          originalPrice: 498.00,
          discountedPrice: 348.60,
          color: 'Green'
        }
    ];
    
  return (
    <div>

     
      <section className="hero">
        <div className="hero-content">
          <button>Shop Now</button>
        </div>
      </section>


      <section className="carts-item container">
                <h2 className="carts-item">Premium PreLoved Smartphones</h2>
                <div className="carts-item product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="carts-item product">
                            <img src={product.image} alt={product.name} className="carts-item"/>
                            <h3 className="carts-item">{product.name}</h3>
                            <p className="carts-item price">
                                <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                NPR {product.discountedPrice.toLocaleString()}
                            </p>
                            <button 
                                className="carts-item" 
                                onClick={() => addToCart({
                                    ...product,
                                    price: product.discountedPrice,
                                    image: product.image
                                })}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>



            <section className="carts-item container">
                <div className="carts-item product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="carts-item product">
                            <img src={product.image} alt={product.name} className="carts-item"/>
                            <h3 className="carts-item">{product.name}</h3>
                            <p className="carts-item price">
                                <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                NPR {product.discountedPrice.toLocaleString()}
                            </p>
                            <button 
                                className="carts-item" 
                                onClick={() => addToCart({
                                    ...product,
                                    price: product.discountedPrice,
                                    image: product.image
                                })}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>


            <section className="carts-item container">
                <div className="carts-item product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="carts-item product">
                            <img src={product.image} alt={product.name} className="carts-item"/>
                            <h3 className="carts-item">{product.name}</h3>
                            <p className="carts-item price">
                                <del>NPR {product.originalPrice.toLocaleString()}</del> 
                                NPR {product.discountedPrice.toLocaleString()}
                            </p>
                            <button 
                                className="carts-item" 
                                onClick={() => addToCart({
                                    ...product,
                                    price: product.discountedPrice,
                                    image: product.image
                                })}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>



            <section className="different-equipment container">
        <h2 className="different-equipment">Multi Buy Offer</h2>
        <p className="different-equipment offer-text">Get up to 30% off selected Galaxy products on selected Watches, Tablets, Buds and more</p>
        <div className="different-equipment product-grid">
          {galaxyProducts.map((product) => (
            <div key={product.id} className="different-equipment product">
              <img src={product.image} alt={product.name} className="different-equipment"/>
              <h3 className="different-equipment">{product.name}</h3>
              <p className="different-equipment color">
                <strong>Color :</strong> {product.color}
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
                onClick={() => addToCart({
                  ...product,
                  price: product.discountedPrice,
                  image: product.image
                })}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>




   
    <header className="banner-content-header">
        <div className="banner-content-banner">
            <img src={hero_image} alt="Valentine’s Day Sale Banner"/>
        </div>
    </header>

    <section className="banner-content-services" id="services">
        <h2>Our Services</h2>

        <div className="banner-content-services-container">
            <div className="banner-content-service">
                <img src={sellPhone} alt="Sell Phone"/>
                <p>Sell Phone</p>
            </div>
            <div className="banner-content-service">
                <img src={buyPhone} alt="Buy Phone"/>
                <p>Buy Phone</p>
            </div>
            <div className="banner-content-service">
                <img src={buylaptops} alt="Buy Laptops"/>
                <p>Buy Laptops</p>
            </div>
            <div className="banner-content-service">
                <img src={repairphone} alt="Repair Phone"/>
                <p>Repair Phone</p>
            </div>
            <div className="banner-content-service">
                <img src={repairLaptop} alt="Repair Laptop"/>
                <p>Repair Laptop</p>
            </div>
            <div className="banner-content-service">
                <img src={findnewphone} alt="Find New Phone"/>
                <p>Find New Phone</p>
            </div>
            <div className="banner-content-service">
                <img src={nearbystore} alt="Nearby Stores"/>
                <p>Nearby Stores</p>
            </div>
            <div className="banner-content-service">
                <img src={buySmartWatches} alt="Buy Smartwatches"/>
                <p>Buy Smartwatches</p>
            </div>
            <div className="banner-content-service">
                <img src={recycle} alt="Recycle"/>
                <p>Recycle</p>
            </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
