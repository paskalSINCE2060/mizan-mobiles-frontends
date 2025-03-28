import React from 'react'
import "./Watches.css"
import watch from '../../src/assets/GalaxyWatchUltra.jpeg'
const Watches = () => {
  return (
    <>
    <div className="smart-phone-container">
        <div className="smart-phone-card">
            <img src={watch} alt="Watch 1" className="smart-phone-image"/>
            <h2 className="smart-phone-name">Rolex Submariner</h2>
            <p className="smart-phone-price"><span className="smart-phone-old-price">RS.12,000</span> RS.10,500</p>
            <button className="smart-phone-btn">Add to Cart</button>
        </div>

        <div className="smart-phone-card">
            <img src={watch} alt="Watch 2" className="smart-phone-image"/>
            <h2 className="smart-phone-name">Omega Seamaster</h2>
            <p className="smart-phone-price"><span className="smart-phone-old-price">RS.8,500</span> RS.7,200</p>
            <button className="smart-phone-btn">Add to Cart</button>
        </div>

        <div className="smart-phone-card">
            <img src={watch} alt="Watch 3" className="smart-phone-image"/>
            <h2 className="smart-phone-name">Tag Heuer Carrera</h2>
            <p className="smart-phone-price"><span className="smart-phone-old-price">RS.5,000</span> RS.4,200</p>
            <button className="smart-phone-btn">Add to Cart</button>
        </div>

        <div className="smart-phone-card">
            <img src={watch} alt="Watch 4" className="smart-phone-image"/>
            <h2 className="smart-phone-name">Apple Watch Ultra</h2>
            <p className="smart-phone-price"><span className="smart-phone-old-price">RS.899</span> RS.799</p>
            <button className="smart-phone-btn">Add to Cart</button>
        </div>
    </div>


<div className="smart-phone-container">
<div className="smart-phone-card">
    <img src={watch} alt="Watch 1" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Rolex Submariner</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.12,000</span> RS.10,500</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={watch} alt="Watch 2" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Omega Seamaster</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.8,500</span> RS.7,200</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={watch} alt="Watch 3" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Tag Heuer Carrera</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.5,000</span> RS.4,200</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={watch} alt="Watch 4" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Apple Watch Ultra</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.899</span> RS.799</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>
</div>
</>
  )
}

export default Watches
