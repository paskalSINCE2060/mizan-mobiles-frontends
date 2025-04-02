import React from 'react';
import "./Airpods.css";
import airpodsImage from '../../assets/GalaxyBuds3Pro.jpeg';
import { useCart } from '../../context/cartContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Airpods = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: airpodsImage,
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
        image: airpodsImage,
        originalPrice: product.oldPrice,
        discountedPrice: product.price,
        description: `The ${product.name} is a premium tablet designed for productivity and entertainment with a high-resolution display and powerful performance.`,
        specs: {
          storage: '256GB',
          display: '11-inch Liquid Retina display',
          battery: 'Up to 10 hours of web surfing',
          processor: 'High-performance processor',
          connectivity: 'Wi-Fi 6, Bluetooth 5.0',
          camera: '12MP Wide camera'
        }
      };
      
      // Navigate to product details with product data
      navigate('/productdetails', { state: { product: detailedProduct } });
    };

  const airpodsProducts = [
    {
      id: "airpods-pro",
      name: "Apple AirPods Pro",
      oldPrice: 20000,
      price: 18000,
      image: airpodsImage
    },
    {
      id: "airpods-2nd-gen",
      name: "AirPods 2nd Generation",
      oldPrice: 15000,
      price: 13000,
      image: airpodsImage
    },
    {
      id: "airpods-3",
      name: "Apple AirPods 3",
      oldPrice: 18000,
      price: 16000,
      image: airpodsImage
    },
    {
      id: "beats-fit-pro",
      name: "Beats Fit Pro",
      oldPrice: 25000,
      price: 22500,
      image: airpodsImage
    },
    {
      id: "galaxy-buds-pro",
      name: "Samsung Galaxy Buds Pro",
      oldPrice: 14000,
      price: 12500,
      image: airpodsImage
    },
    {
      id: "jbl-tune-230nc",
      name: "JBL Tune 230NC",
      oldPrice: 10000,
      price: 9000,
      image: airpodsImage
    },
    {
      id: "sony-wf-1000xm4",
      name: "Sony WF-1000XM4",
      oldPrice: 18500,
      price: 16000,
      image: airpodsImage
    },
    {
      id: "sennheiser-momentum-2",
      name: "Sennheiser Momentum True Wireless 2",
      oldPrice: 25000,
      price: 22000,
      image: airpodsImage
    }
  ];

  // First four airpods for first row
  const firstRowAirpods = airpodsProducts.slice(0, 4);
  // Last four airpods for second row
  const secondRowAirpods = airpodsProducts.slice(4, 8);

  return (
    <>
      <ToastContainer />
      <div className="airpods-container">
        {firstRowAirpods.map((item) => (
          <div key={item.id} className="airpods-card">
            <img src={item.image}
             alt={item.name}
             className="airpods-image"
             onClick={() => handleProductClick(item)}
              style={{ cursor: 'pointer' }} />
            <h2 className="airpods-name">{item.name}</h2>
            <p className="airpods-price">
              <span className="airpods-old-price">RS.{item.oldPrice.toLocaleString()}</span> RS.{item.price.toLocaleString()}
            </p>
            <button 
              className="airpods-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="airpods-container">
        {secondRowAirpods.map((item) => (
          <div key={item.id} className="airpods-card">
            <img src={item.image}
             alt={item.name}
              className="airpods-image"
              onClick={() => handleProductClick(item)}
              style={{ cursor: 'pointer' }} />
            <h2 className="airpods-name">{item.name}</h2>
            <p className="airpods-price">
              <span className="airpods-old-price">RS.{item.oldPrice.toLocaleString()}</span> RS.{item.price.toLocaleString()}
            </p>
            <button 
              className="airpods-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Airpods;