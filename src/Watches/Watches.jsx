import React from 'react';
import "./Watches.css";
import watch from '../../src/assets/GalaxyWatchUltra.jpeg';
import { useCart } from '../context/cartContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Watches = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: watch,
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
            <img src={item.image} alt={item.name} className="watches-image" />
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
            <img src={item.image} alt={item.name} className="watches-image" />
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