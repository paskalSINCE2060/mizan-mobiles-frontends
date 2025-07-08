import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../slice/cartSlice';
import { toast } from 'react-toastify';
import { FaHeart, FaCartPlus, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../../hooks/useWishlist';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 1500,
      theme: 'light',
    });
  };

  const handleWishlistClick = () => {
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product._id);

  // Calculate discount percentage
  const discountPercentage = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-card-img-wrapper">
        {discountPercentage > 0 && (
          <div className="discount-badge">
            -{discountPercentage}%
          </div>
        )}
        <button
          className={`wishlist-icon-btn ${inWishlist ? 'in-wishlist' : ''}`}
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
        <img src={product.image} alt={product.name} className="product-card-img" />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-prices">
          {product.oldPrice && product.oldPrice > product.price ? (
            <>
              <span className="product-card-new-price">Rs. {product.price}</span>
              <span className="product-card-old-price">Rs. {product.oldPrice}</span>
            </>
          ) : (
            <span className="product-card-new-price">Rs. {product.price}</span>
          )}
        </div>
        <button className="cart-btn" onClick={handleAddToCart}>
          <FaCartPlus />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;