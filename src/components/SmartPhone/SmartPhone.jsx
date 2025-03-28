import React from 'react'
import sellPhone from '../../assets/sellPhone.webp'
import "./SmartPhone.css"
const SmartPhone = () => {
  return (
    <>
    <div className="smart-phone-container">
    <div className="smart-phone-card">
        <img src={sellPhone} alt="Smartphone 1" className="smart-phone-image"/>
        <h2 className="smart-phone-name">iPhone 14 Pro</h2>
        <p className="smart-phone-price"><span className="smart-phone-old-price">RS.1199</span> RS.999</p>
        <button className="smart-phone-btn">Add to Cart</button>
    </div>

    <div className="smart-phone-card">
        <img src={sellPhone} alt="Smartphone 2" className="smart-phone-image"/>
        <h2 className="smart-phone-name">Samsung Galaxy S23</h2>
        <p className="smart-phone-price"><span className="smart-phone-old-price">RS.1099</span> RS.949</p>
        <button className="smart-phone-btn">Add to Cart</button>
    </div>

    <div className="smart-phone-card">
        <img src={sellPhone} alt="Smartphone 3" className="smart-phone-image"/>
        <h2 className="smart-phone-name">Google Pixel 8 Pro</h2>
        <p className="smart-phone-price"><span className="smart-phone-old-price">RS.999</span> RS.899</p>
        <button className="smart-phone-btn">Add to Cart</button>
    </div>

    <div className="smart-phone-card">
        <img src={sellPhone} alt="Smartphone 4" className="smart-phone-image"/>
        <h2 className="smart-phone-name">OnePlus 11</h2>
        <p className="smart-phone-price"><span className="smart-phone-old-price">RS.799</span> RS.699</p>
        <button className="smart-phone-btn">Add to Cart</button>
    </div>

</div>

<div className="smart-phone-container">
<div className="smart-phone-card">
    <img src={sellPhone} alt="Smartphone 1" className="smart-phone-image"/>
    <h2 className="smart-phone-name">iPhone 14 Pro</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.1199</span> RS.999</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={sellPhone} alt="Smartphone 2" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Samsung Galaxy S23</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.1099</span> RS.949</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={sellPhone} alt="Smartphone 3" className="smart-phone-image"/>
    <h2 className="smart-phone-name">Google Pixel 8 Pro</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.999</span> RS.899</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

<div className="smart-phone-card">
    <img src={sellPhone} alt="Smartphone 4" className="smart-phone-image"/>
    <h2 className="smart-phone-name">OnePlus 11</h2>
    <p className="smart-phone-price"><span className="smart-phone-old-price">RS.799</span> RS.699</p>
    <button className="smart-phone-btn">Add to Cart</button>
</div>

</div>
</>
  )
}

export default SmartPhone
