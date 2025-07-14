import React from 'react';
import smartphone from '../../assets/sellPhone.webp';
import watch from '../../assets/GalaxyWatch7.jpeg';
import laptop from '../../assets/iphone13promax.png';
import earphones from '../../assets/GalaxyBuds3.jpeg'; // Assuming you have a different image for earphones
import './Category.css';

const Category = () => {
  return (
    <main className="product-categories-container">
      <section className="categories">
        <div className="category category-smartphone">
          <div className="category-image-wrapper">
            <img src={smartphone} alt="Smartphones" className="category-image"/>
          </div>
          <div className="category-content">
            <h2>Smartphones</h2>
            <p>Latest mobile technology</p>
            <a href="/smartphone" className="category-link">Shop Now</a>
          </div>
        </div>
        <div className="category category-accessories">
          <div className="category-image-wrapper">
            <img src={watch} alt="Accessories" className="category-image"/>
          </div>
          <div className="category-content">
            <h2>Accessories</h2>
            <p>Essential tech companions</p>
            <a href="/watches" className="category-link">Explore</a>
          </div>
        </div>
        <div className="category category-Laptops">
          <div className="category-image-wrapper">
            <img src={laptop} alt="Laptops" className="category-image"/>
          </div>
          <div className="category-content">
            <h2>Laptops</h2>
            <p>Portable computing power</p>
            <a href="/laptops" className="category-link">Browse</a>
          </div>
        </div>
        <div className="category category-earphones">
          <div className="category-image-wrapper">
            <img src={earphones} alt="Earphones" className="category-image"/>
          </div>
          <div className="category-content">
            <h2>Earphones</h2>
            <p>Audio excellence</p>
            <a href="/airpods" className="category-link">View Collection</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Category;