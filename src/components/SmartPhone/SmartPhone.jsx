import React from 'react';
import sellPhone from '../../assets/sellPhone.webp';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./SmartPhone.css";

const SmartPhone = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: sellPhone,
      quantity: 1
    });
    
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

  const handleProductClick = (product) => {
    // Add detailed product information
    const detailedProduct = {
      ...product,
      image: sellPhone,
      originalPrice: product.oldPrice,
      discountedPrice: product.price,
      description: `The ${product.name} is a high-end smartphone with cutting-edge features and performance.`,
      specs: {
        storage: '128GB',
        display: '6.1-inch Super Retina XDR',
        battery: 'Up to 24 hours video playback',
        camera: 'Triple 12MP camera system'
      }
    };
    
    // Navigate to product details with product data
    navigate('/productdetails', { state: { product: detailedProduct } });
  };

  const smartphones = [
    {
      id: "iphone14pro",
      name: "iPhone 14 Pro",
      oldPrice: 1199,
      price: 999,
      image: sellPhone
    },
    {
      id: "samsungs23",
      name: "Samsung Galaxy S23",
      oldPrice: 1099,
      price: 949,
      image: sellPhone
    },
    {
      id: "pixel8pro",
      name: "Google Pixel 8 Pro",
      oldPrice: 999,
      price: 899,
      image: sellPhone
    },
    {
      id: "oneplus11",
      name: "OnePlus 11",
      oldPrice: 799,
      price: 699,
      image: sellPhone
    }
  ];

  return (
    <>
      <ToastContainer />
      <div className="smart-phone-container">
        {smartphones.map((phone) => (
          <div key={phone.id} className="smart-phone-card">
            <img 
              src={phone.image} 
              alt={phone.name} 
              className="smart-phone-image"
              onClick={() => handleProductClick(phone)}
              style={{ cursor: 'pointer' }}
            />
            <h2 className="smart-phone-name">{phone.name}</h2>
            <p className="smart-phone-price">
              <span className="smart-phone-old-price">RS.{phone.oldPrice}</span> RS.{phone.price}
            </p>
            <button 
              className="smart-phone-btn"
              onClick={() => handleAddToCart(phone)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="smart-phone-container">
        {smartphones.map((phone) => (
          <div key={`second-${phone.id}`} className="smart-phone-card">
            <img 
              src={phone.image} 
              alt={phone.name} 
              className="smart-phone-image"
              onClick={() => handleProductClick(phone)}
              style={{ cursor: 'pointer' }}
            />
            <h2 className="smart-phone-name">{phone.name}</h2>
            <p className="smart-phone-price">
              <span className="smart-phone-old-price">RS.{phone.oldPrice}</span> RS.{phone.price}
            </p>
            <button 
              className="smart-phone-btn"
              onClick={() => handleAddToCart(phone)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SmartPhone;