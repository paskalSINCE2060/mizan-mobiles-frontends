import React from 'react';
import "./Watches.css";
import watch from '../../src/assets/GalaxyWatchUltra.jpeg';

const Watches = () => {
  return (
    <>
      <div className="watches-container">
        <div className="watches-card">
          <img src={watch} alt="Watch 1" className="watches-image" />
          <h2 className="watches-name">Rolex Submariner</h2>
          <p className="watches-price"><span className="watches-old-price">RS.12,000</span> RS.10,500</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 2" className="watches-image" />
          <h2 className="watches-name">Omega Seamaster</h2>
          <p className="watches-price"><span className="watches-old-price">RS.8,500</span> RS.7,200</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 3" className="watches-image" />
          <h2 className="watches-name">Tag Heuer Carrera</h2>
          <p className="watches-price"><span className="watches-old-price">RS.5,000</span> RS.4,200</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 4" className="watches-image" />
          <h2 className="watches-name">Apple Watch Ultra</h2>
          <p className="watches-price"><span className="watches-old-price">RS.899</span> RS.799</p>
          <button className="watches-btn">Add to Cart</button>
        </div>
      </div>

      <div className="watches-container">
        <div className="watches-card">
          <img src={watch} alt="Watch 1" className="watches-image" />
          <h2 className="watches-name">Rolex Submariner</h2>
          <p className="watches-price"><span className="watches-old-price">RS.12,000</span> RS.10,500</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 2" className="watches-image" />
          <h2 className="watches-name">Omega Seamaster</h2>
          <p className="watches-price"><span className="watches-old-price">RS.8,500</span> RS.7,200</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 3" className="watches-image" />
          <h2 className="watches-name">Tag Heuer Carrera</h2>
          <p className="watches-price"><span className="watches-old-price">RS.5,000</span> RS.4,200</p>
          <button className="watches-btn">Add to Cart</button>
        </div>

        <div className="watches-card">
          <img src={watch} alt="Watch 4" className="watches-image" />
          <h2 className="watches-name">Apple Watch Ultra</h2>
          <p className="watches-price"><span className="watches-old-price">RS.899</span> RS.799</p>
          <button className="watches-btn">Add to Cart</button>
        </div>
      </div>
    </>
  );
};

export default Watches;
