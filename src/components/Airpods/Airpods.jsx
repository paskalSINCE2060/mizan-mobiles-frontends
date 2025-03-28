import React from 'react';
import "./Airpods.css";
import airpodsImage from '../../assets/GalaxyBuds3Pro.jpeg'; 

const Airpods = () => {
  return (
    <>
      <div className="airpods-container">
        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 1" className="airpods-image" />
          <h2 className="airpods-name">Apple AirPods Pro</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.20,000</span> RS.18,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 2" className="airpods-image" />
          <h2 className="airpods-name">AirPods 2nd Generation</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.15,000</span> RS.13,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 3" className="airpods-image" />
          <h2 className="airpods-name">Apple AirPods 3</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.18,000</span> RS.16,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 4" className="airpods-image" />
          <h2 className="airpods-name">Beats Fit Pro</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.25,000</span> RS.22,500</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>
      </div>

      <div className="airpods-container">
        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 5" className="airpods-image" />
          <h2 className="airpods-name">Samsung Galaxy Buds Pro</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.14,000</span> RS.12,500</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 6" className="airpods-image" />
          <h2 className="airpods-name">JBL Tune 230NC</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.10,000</span> RS.9,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 7" className="airpods-image" />
          <h2 className="airpods-name">Sony WF-1000XM4</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.18,500</span> RS.16,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>

        <div className="airpods-card">
          <img src={airpodsImage} alt="Airpods 8" className="airpods-image" />
          <h2 className="airpods-name">Sennheiser Momentum True Wireless 2</h2>
          <p className="airpods-price"><span className="airpods-old-price">RS.25,000</span> RS.22,000</p>
          <button className="airpods-btn">Add to Cart</button>
        </div>
      </div>
    </>
  );
};

export default Airpods;
