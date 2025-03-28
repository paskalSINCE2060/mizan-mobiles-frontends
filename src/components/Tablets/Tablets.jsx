import React from 'react';
import "./Tablets.css";
import tablet from '../../assets/iphone11promax.jpeg'; 

const Tablets = () => {
  return (
    <>
      <div className="Tablets-container">
        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 1" className="Tablets-image" />
          <h2 className="Tablets-name">Apple iPad Pro</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.60,000</span> RS.55,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 2" className="Tablets-image" />
          <h2 className="Tablets-name">Samsung Galaxy Tab S8</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.50,000</span> RS.45,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 3" className="Tablets-image" />
          <h2 className="Tablets-name">Microsoft Surface Pro 7</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.70,000</span> RS.65,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 4" className="Tablets-image" />
          <h2 className="Tablets-name">Huawei MatePad Pro</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.40,000</span> RS.35,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>
      </div>

      <div className="Tablets-container">
        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 5" className="Tablets-image" />
          <h2 className="Tablets-name">Apple iPad Mini</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.35,000</span> RS.32,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 6" className="Tablets-image" />
          <h2 className="Tablets-name">Lenovo Tab P11 Pro</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.40,000</span> RS.38,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 7" className="Tablets-image" />
          <h2 className="Tablets-name">Samsung Galaxy Tab A8</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.20,000</span> RS.18,000</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>

        <div className="Tablets-card">
          <img src={tablet} alt="Tablet 8" className="Tablets-image" />
          <h2 className="Tablets-name">Amazon Fire HD 10</h2>
          <p className="Tablets-price"><span className="Tablets-old-price">RS.15,000</span> RS.13,500</p>
          <button className="Tablets-btn">Add to Cart</button>
        </div>
      </div>
    </>
  );
};

export default Tablets;
