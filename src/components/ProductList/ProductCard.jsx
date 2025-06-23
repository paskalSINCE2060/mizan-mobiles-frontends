import React from 'react';
import { getCategoryDisplayName } from './category';

const ProductCard = ({ product, onEdit, onDelete, getSafeImageUrl, handleImageError }) => {
  return (
    <div className="admin-product-card">
      <div className="product-image">
        <img 
          src={getSafeImageUrl(product)} 
          alt={product.name}
          onError={(e) => handleImageError(product._id, e)}
          loading="lazy"
        />
        <div className="product-badges">
          {product.featured && <span className="badge featured">Featured</span>}
          <span className={`badge stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      <div className="product-details">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-category">{getCategoryDisplayName(product.category)}</span>
        </div>
        
        <p className="product-brand">{product.brand || 'Unknown Brand'}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-pricing">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && (
            <span className="old-price">${product.oldPrice}</span>
          )}
        </div>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="specs-preview">
            {product.specs.storage && <span className="spec-tag">{product.specs.storage}</span>}
            {product.specs.color && <span className="spec-tag">{product.specs.color}</span>}
          </div>
        )}
      </div>
      
      <div className="product-actions">
        <button className="btn-edit" onClick={onEdit}>
          Edit Product
        </button>
        <button className="btn-delete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;