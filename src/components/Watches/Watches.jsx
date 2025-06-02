import React from 'react';
import "./Watches.css";
import watch from '../../assets/GalaxyWatchUltra.jpeg';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../slice/cartSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Watches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const cartItem=({
      id: product.id,
      name: product.name,
      price: product.price,
      image: watch,
      quantity: 1
    });
        dispatch(addToCart(cartItem));
    
    
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
      image: watch,
      originalPrice: product.oldPrice,
      discountedPrice: product.price,
      description: `The ${product.name} is a premium timepiece combining elegant design with precision engineering and advanced technology.`,
      specs: {
        material: 'Premium stainless steel',
        display: 'Sapphire crystal glass',
        waterResistance: 'Up to 100 meters',
        movement: 'Swiss-made automatic movement',
        features: 'Chronograph, date display',
        battery: product.id.includes('apple') ? 'Up to 36 hours' : 'Not applicable'
      }
    };
    
    // Navigate to product details with product data
    navigate('/productdetails', { state: { product: detailedProduct } });
  };

  const watches = [
    {
      id: "rolex-submariner",
      name: "Rolex Submariner",
      oldPrice: 12000,
      price: 10500,
      image: watch
    },
    {
      id: "omega-seamaster",
      name: "Omega Seamaster",
      oldPrice: 8500,
      price: 7200,
      image: watch
    },
    {
      id: "tag-heuer-carrera",
      name: "Tag Heuer Carrera",
      oldPrice: 5000,
      price: 4200,
      image: watch
    },
    {
      id: "apple-watch-ultra",
      name: "Apple Watch Ultra",
      oldPrice: 899,
      price: 799,
      image: watch
    }
  ];

  return (
    <>
      <ToastContainer />
      <div className="watches-container">
        {watches.map((item) => (
          <div key={item.id} className="watches-card">
            <img 
              src={item.image} 
              alt={item.name} 
              className="watches-image" 
              onClick={() => handleProductClick(item)}
              style={{ cursor: 'pointer' }}
            />
            <h2 className="watches-name">{item.name}</h2>
            <p className="watches-price">
              <span className="watches-old-price">RS.{item.oldPrice.toLocaleString()}</span> RS.{item.price.toLocaleString()}
            </p>
            <button 
              className="watches-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="watches-container">
        {watches.map((item) => (
          <div key={`second-${item.id}`} className="watches-card">
            <img 
              src={item.image} 
              alt={item.name} 
              className="watches-image" 
              onClick={() => handleProductClick(item)}
              style={{ cursor: 'pointer' }}
            />
            <h2 className="watches-name">{item.name}</h2>
            <p className="watches-price">
              <span className="watches-old-price">RS.{item.oldPrice.toLocaleString()}</span> RS.{item.price.toLocaleString()}
            </p>
            <button 
              className="watches-btn"
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

export default Watches;