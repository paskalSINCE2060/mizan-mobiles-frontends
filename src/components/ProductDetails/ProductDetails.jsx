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
    <div className="product-container">
      <div className="product-main">
        <img src={products} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">${product.discountPrice} <span className="original-price">${product.price}</span></p>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab("description")} className={activeTab === "description" ? "active-tab" : ""}>Description</button>
        <button onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? "active-tab" : ""}>Reviews</button>
      </div>

      <div className="tab-content">
        {activeTab === "description" ? <p>{product.description}</p> : <p>{product.reviews}</p>}
      </div>

      <h3 className="related-title">Related Products</h3>
      <div className="related-products">
        {relatedProducts.map((item) => (
          <div key={item.id} className="related-item">
            <img src={item.image} alt={item.name} className="related-image" />
            <h4 className="related-name">{item.name}</h4>
            <p className="related-price">${item.discountPrice} <span className="original-price">${item.price}</span></p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
