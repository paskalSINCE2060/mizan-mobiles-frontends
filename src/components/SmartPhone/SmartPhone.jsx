import React from 'react';
import sellPhone from '../../assets/sellPhone.webp';
import { useCart } from '../../context/cartContext';
import "./SmartPhone.css";

const SmartPhone = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: sellPhone,
      quantity: 1
    });
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
      <div className="smart-phone-container">
        {smartphones.map((phone) => (
          <div key={phone.id} className="smart-phone-card">
            <img src={phone.image} alt={phone.name} className="smart-phone-image"/>
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
            <img src={phone.image} alt={phone.name} className="smart-phone-image"/>
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