import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../slice/cartSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product, isAdmin = false, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success('Product added to cart!');
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-img" />
      <h3>{product.name}</h3>
      <p className="product-price">Rs. {product.price}</p>

      {!isAdmin && (
        <button className="add-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}

      {isAdmin && (
        <div className="admin-controls">
          <button className="edit-btn" onClick={() => onEdit(product._id)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(product._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
