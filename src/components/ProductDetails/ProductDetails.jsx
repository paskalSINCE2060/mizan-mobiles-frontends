import { useState } from "react";
import "./ProductDetails.css";
import products from "../../assets/BuyLaptops.webp"

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("description");

  const product = {
    name: "Product Name",
    price: 100,
    discountPrice: 80,
    image: "https://via.placeholder.com/400",
    description: "This is the product description. It provides details about the product.",
    reviews: "This product has great reviews! Highly recommended.",
  };

  const relatedProducts = [
    { id: 1, name: "Product 1", price: 50, discountPrice: 40, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 60, discountPrice: 50, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", price: 70, discountPrice: 55, image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="Product-details-container">
      <div className="Product-details-main">
        <img src={products} alt={product.name} className="Product-details-image" />
        <div className="Product-details-info">
          <h2 className="Product-details-name">{product.name}</h2>
          <p className="Product-details-price">
            ${product.discountPrice} <span className="Product-details-original-price">${product.price}</span>
          </p>
          <button className="Product-details-add-to-cart">Add to Cart</button>
        </div>
      </div>

      <div className="Product-details-tabs">
        <button 
          onClick={() => setActiveTab("description")} 
          className={`Product-details-tab ${activeTab === "description" ? "Product-details-active-tab" : ""}`}
        >
          Description
        </button>
        <button 
          onClick={() => setActiveTab("reviews")} 
          className={`Product-details-tab ${activeTab === "reviews" ? "Product-details-active-tab" : ""}`}
        >
          Reviews
        </button>
      </div>

      <div className="Product-details-tab-content">
        {activeTab === "description" ? (
          <p>{product.description}</p>
        ) : (
          <p>{product.reviews}</p>
        )}
      </div>

      <h3 className="Product-details-related-title">Related Products</h3>
      <div className="Product-details-related-products">
        {relatedProducts.map((item) => (
          <div key={item.id} className="Product-details-related-item">
            <img 
              src={item.image} 
              alt={item.name} 
              className="Product-details-related-image" 
            />
            <h4 className="Product-details-related-name">{item.name}</h4>
            <p className="Product-details-related-price">
              ${item.discountPrice} <span className="Product-details-original-price">${item.price}</span>
            </p>
            <button className="Product-details-add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;